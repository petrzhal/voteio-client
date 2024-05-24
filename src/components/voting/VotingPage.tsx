import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import VotingService from "../../services/VotingService";
import {Voting} from "../../models/Voting";
import {Position} from "../../models/Position";
import "./styles/VotingPage.css";
import {Comment} from "../../models/Comment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {User} from "../../models/User";
import Participants from "../participants/Participants";

const VotingPage = () => {
    const {id} = useParams();
    const votingId = parseInt(id ? id.toString() : "0", 10);
    const [voting, setVoting] = useState<Voting | null>(null);
    const [voted, setVoted] = useState<Position | null>(null);
    const [positions, setPositions] = useState<Map<Position, number> | null>(null);
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [position, setPosition] = useState(-1);
    const [text, setText] = useState("");
    const [users, setUsers] = useState<User[] | null>([]);
    const [isStarted, setIsStarted] = useState<boolean>(true);
    const [isEnded, setIsEnded] = useState<boolean>(true);
    const {store} = useContext(Context);
    const navigate = useNavigate();

    const fetchVotes = async (position_id: number) => {
        try {
            const response = await VotingService.votesForPosition(position_id);
            return response.data;
        } catch (error) {
            console.error('fetch error', error);
        }
    }

    const fetchVoting = async () => {
        try {
            const response = await VotingService.getVoting(votingId);
            setVoting(response.data);
        } catch (error) {
            console.error('fetch error', error);
        }
    };
    const fetchPosition = async () => {
        try {
            const response = await VotingService.getPositionsForVoting(votingId);
            const positions = response.data;
            let posMap = new Map();
            for (let pos of positions) {
                const votes = await fetchVotes(pos.id);
                posMap.set(pos, votes);
            }
            setPositions(posMap);
        } catch (error: any) {
            console.error('fetch error', error);
        }
    };

    const fetchComments = async (voting_id: number) => {
        try {
            const response = await VotingService.getComments(voting_id);
            setComments(response.data);
        } catch (error: any) {
            console.error('fetch error', error);
        }
    };

    const checkVotedPosition = async () => {
        try {
            const response = await VotingService.getVotedPosition(votingId);
            setVoted(response.data);
            setPosition(voted ? voted.id : -1);
            console.log(response.data);
        } catch (error: any) {
            setVoted(null);
            console.error('fetch error', error);
        }
    }

    const fetchUsers = async (position_id: number) => {
        try {
            if (voting?.type === "DEFAULT") {
                const response = await VotingService.getUsersForPosition(position_id);
                setUsers(response.data);
                console.log(users);
            }
        } catch (error: any) {
            console.log(error.response.error);
        }
    }

    const checkDate = () => {
        const now = new Date();
        if (!voting) return;

        const beginDate = new Date(voting.begin_date);
        beginDate.setHours(beginDate.getHours() + 3);

        const endDate = new Date(voting.end_date);
        endDate.setHours(endDate.getHours() + 3);

        setIsStarted(now >= beginDate);
        setIsEnded(now > endDate);
    };

    useEffect(() => {
        fetchVoting().then();
        checkVotedPosition().then();
        fetchPosition().then();
        fetchComments(votingId).then();
    }, [votingId]);
    useEffect(() => {
        checkDate();
    }, [voting, isEnded]);

    const Vote = async (position_id: number) => {
        try {
            await VotingService.addVote(votingId, position_id);
            fetchPosition().then();
            checkVotedPosition().then();
        } catch (error: any) {
            if (error.response?.data?.message === 'user already voted') {
                alert("You have already voted");
            } else if (error.response?.status === 401) {
                navigate("/login");
            }
            console.error("Can not vote", error);
        }
    }

    const Retract = async (position_id: number) => {
        try {
            await VotingService.retractVote(position_id);
            await fetchPosition().then();
            await checkVotedPosition().then();
            setVoted(null);
        } catch (error: any) {
            console.error("Can not retract", error);
        }
    }

    const AddComment = async (text: string) => {
        try {
            await VotingService.addComment(votingId, {text});
            await fetchComments(votingId).then();
            setText("");
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    if (!voting || !positions) {

        return <div>Loading...</div>;
    }

    const formatDate = (date: Date) => {
        const dateF = new Date(date);
        dateF.setHours(dateF.getHours() + 3);

        const d = new Date(dateF);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${day}:${month}:${year} ${hours}:${minutes}`;
    };

    return (
        <div className="page">
            {isStarted ?
                <div className={"container"}>
                    {voting?.type === "DEFAULT" ? <Participants users={users}/> : <div/>}
                    <div className={"voting-form"}>
                        <div className={"title"}>{voting?.title}</div>
                        <div className={"description"}>{voting?.description}<br/>{" category: "}{voting.category}</div>
                        <div className={"position-container"}>
                            {voted || isEnded ? Array.from(positions.entries()).map(([pos, votes]) =>
                                <div
                                    className={pos.id === voted?.id ? "position-container-item-active" : "position-container-item"}
                                    onMouseOverCapture={() => {
                                        fetchUsers(pos.id).then();
                                    }}>
                                    <div key={pos.id}
                                    >{`${pos.description}`}</div>
                                    <span>{`${votes}`}</span>
                                </div>
                            ) : Array.from(positions.entries()).map(([pos, votes]) =>
                                <div
                                    className={position === pos.id ? "position-container-item-active" : "position-container-item"}
                                    onClick={() => {
                                        setPosition(pos.id)
                                    }}
                                    onMouseOverCapture={() => {
                                        fetchUsers(pos.id).then();
                                    }}>
                                    <div key={pos.id}>{`${pos.description}`}</div>
                                    <span>{votes}</span>
                                </div>
                            )}
                        </div>
                        {store.isAuth ? isEnded ? <div className={"end-message"}>{`Ended ${formatDate(voting.end_date)}`}</div> :
                                (
                                    !voted ? <button className={"vote-button"} onClick={() => {
                                            Vote(position).then()
                                        }} type={'button'}>Vote
                                        </button> :
                                        <button className={"vote-button"} onClick={() => {
                                            Retract(voted?.id).then()
                                        }} type={'button'}>Retract
                                        </button>
                                )
                            :
                            <div/>
                        }
                    </div>
                    {voting?.type === "DEFAULT" ? <div className={"comment-form"}>
                        <div className={"title"}>Comments</div>
                        <div className={"comment-container"}>
                            {comments?.map(comment => {
                                const commentDate = new Date(comment.publication_date);
                                const formattedDate = `${commentDate.getDate().toString().padStart(2, '0')}:${(commentDate.getMonth() + 1).toString().padStart(2, '0')}:${commentDate.getFullYear()}`;
                                return (
                                    <div className={"comment"} key={comment.id}>
                                        <div className={"login"}>{`${comment.creator}`}</div>
                                        <div className={"date"}>{formattedDate}</div>
                                        <div className={"content"}>{comment.text}</div>
                                    </div>
                                );
                            })}
                        </div>
                        {store.isAuth ? <div className={"add-comment"}>
                            <input placeholder={"Comment"} value={text} onChange={e => setText(e.target.value)}></input>
                            <button type={"button"} onClick={
                                () => {
                                    AddComment(text).then()
                                }
                            }>
                                <FontAwesomeIcon icon={faPaperPlane}/>
                            </button>
                        </div> : <div/>}
                    </div> : <div/>}
                </div>
                :
                <div className={"container"}>
                    <div/>
                    <div className={"voting-form"}>
                        <div/>
                        <h1>{`Will start ${formatDate(voting.begin_date)}`}</h1>
                    </div>
                </div>
            }
        </div>
    );
};

export default observer(VotingPage);