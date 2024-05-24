import React, {FC, useContext, useEffect, useState} from 'react';
import "./styles/ManageVotings.css"
import {Voting} from "../../models/Voting";
import VotingService from "../../services/VotingService";
import {Position} from "../../models/Position";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlusCircle, faTrashCan, faPlus} from '@fortawesome/free-solid-svg-icons'
import {Context} from "../../index";

const ManageVotings: FC = () => {
    const [votings, setVotings] = useState<Voting[]>([]);
    const [picked, setPicked] = useState<Voting | undefined>(undefined);
    const [positions, setPositions] = useState<Position[] | null>(null);
    const [positionDescription, setPosDescription] = useState("");
    const [position, setPosition] = useState(-1);
    const {store} = useContext(Context);
    const navigate = useNavigate();

    const handlePickVoting = async (id: number) => {
        setPicked((await VotingService.getVoting(id)).data);
        fetchPosition(id).then();
    };

    const fetchPosition = async (voting_id: number) => {
        try {
            const response = await VotingService.getPositionsForVoting(voting_id);
            setPositions(response.data.reverse());
        } catch (error: any) {
            console.error(error.response?.data?.message);
        }
    }

    const fetchVotings = async () => {
        try {
            setVotings((await VotingService.getCreatedVotings()).data);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    };

    const AddPosition = async (description: string) => {
        try {
            await VotingService.addPosition({description}, picked ? picked.id : -1);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    const DeletePosition = async (id: number) => {
        try {
            await VotingService.removePosition(picked ? picked.id : -1, id);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    const DeleteVoting = async (id: number) => {
        try {
            await VotingService.removeVoting(id);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    useEffect(() => {
        fetchVotings().then();
        console.log(store.user.role)
    }, []);

    return (
        <div className={"manage-page"}>
            <div className="sidebar">
                <h2>Manage votings:</h2>
                {votings.map((voting) => (
                    <div
                        key={voting.id}
                        className={`sidebar-item ${(picked ? picked.id : -1) === voting.id ? 'selected' : ''}`}
                        onClick={() => {
                            setPicked(voting);
                            fetchPosition(voting.id).then();
                        }}
                    >
                        <span>{voting.title}</span>
                        <button
                            className="delete-button"
                            onClick={async (e) => {
                                e.stopPropagation();
                                await DeleteVoting(voting.id);
                                fetchVotings().then();
                                setPicked(undefined);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashCan}/>
                        </button>
                    </div>
                ))}
                <div onClick={() => {
                    navigate("/voting/add")
                }} className={"sidebar-item"}>
                    <FontAwesomeIcon icon={faPlusCircle}/>
                </div>
            </div>
            {picked ? <div className={"Form"}>
                <h1>{picked?.title}</h1>
                <div className={"manage-description"}>{picked?.description}<br/>{" category: "}{picked.category}</div>
                <div className={"position-container"}>
                    {positions?.map(pos =>
                        <div className={"position-container-item"}>
                            <div key={pos.id} onClick={() => {
                                setPosition(pos.id)
                            }}>{`${pos.description}`}
                            </div>
                            <button
                                className="delete-button"
                                onClick={async (e) => {
                                    await DeletePosition(pos.id);
                                    fetchPosition(picked ? picked.id : 0).then();
                                    setPosition(0);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan}/>
                            </button>
                        </div>
                    )}
                </div>
                <div className={"add-position"}>
                    <input value={positionDescription} placeholder={"Position"}
                           onChange={e => {
                               if (e.target.value.length <= 20) {
                                   setPosDescription(e.target.value);
                               } else {
                                   e.target.value = positionDescription;
                               }
                           }}
                    />
                    <button onClick={async () => {
                        if (positionDescription === "") return;
                        await AddPosition(positionDescription);
                        setPosDescription("");
                        fetchPosition(picked ? picked.id : 0).then();
                    }}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
            </div> : <div/>}
        </div>
    )
        ;
};

export default observer(ManageVotings);