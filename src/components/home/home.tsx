import React, {FC, useContext, useEffect, useState} from "react";
import './styles/home.css'
import {Voting} from "../../models/Voting";
import VotingService from "../../services/VotingService";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {User} from "../../models/User";

const Home : FC = () => {
    const [votings, setVotings] = useState<Voting[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [text, setText] = useState("");
    const [searchBy, setSearchBy] = useState("title");
    const navigate = useNavigate();
    useEffect(() => {
        const getVotingRating = async () => {
            try {
                const response = await VotingService.getVotingRating();
                setVotings(response.data);
            } catch (error: any) {
                console.log(error.response?.data?.message);
            }
        };
        const getUserRating = async () => {
            try {
                const response = await VotingService.getUserRating();
                setUsers(response.data);
            } catch (error: any) {
                console.log(error.response?.data?.message);
            }
        };
        getVotingRating().then();
        getUserRating().then();
    }, []);

    const RedirectToVoting = (id: number) => {
        navigate(`/voting/${id}`);
    }

    const SearchByCategory = async (category: string) => {
        try {
            const response = await VotingService.searchByCategory(category);
            setVotings(response.data);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }
    const SearchByTitle = async (title: string) => {
        try {
            const response = await VotingService.searchByTitle(title);
            setVotings(response.data);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }
    return (
        <div className={"home-page"}>
            <div className="home-container">
                <div className="votings-form">
                    <h1>Trending polls:</h1>
                    {votings.map(voting =>
                        <div className={"element"} onClick={() => {
                            RedirectToVoting(voting.id)
                        }} key={voting.id}>{voting.title}</div>
                    )}
                </div>
                <div className="users-form">
                    <div className={"rate-title"}>Users rating:</div>
                    <div className="user-container">
                        {users.map(user =>
                            <div className={"user"} key={user.id}>{user.login}</div>
                        )}
                    </div>
                </div>
                <div className={"search-form"}>
                    <div className={"search-container"}>
                        <input className={"search-input"} placeholder={"Search"} value={text}
                               onChange={e => setText(e.target.value)}></input>
                        <select className={"search-selector"} id="choice" value={searchBy}
                                onChange={(e) => setSearchBy(e.target.value)}>
                            <option value="title">title</option>
                            <option value="category">category</option>
                        </select>
                        <button className={"search-button"} type={"button"} onClick={() => {
                            if (searchBy === "category") {
                                SearchByCategory(text).then();
                            } else if (searchBy === "title") {
                                SearchByTitle(text).then();
                            }
                        }}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default observer(Home);