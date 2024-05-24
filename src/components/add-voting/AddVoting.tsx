import React, {useContext, useState} from 'react';
import VotingService from "../../services/VotingService";
import "./styles/AddVoting.css"
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";

const AddVoting = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("default");
    const [begin_date, setBeginDate] = useState(() =>
        {
            const beginDate = new Date();
            beginDate.setHours(beginDate.getHours() + 3);
            return beginDate.toISOString().slice(0, 16);
        }
    );
    const [end_date, setEndDate] = useState(() =>
        {
            const endDate = new Date();
            endDate.setHours(endDate.getHours() + 27);
            return endDate.toISOString().slice(0, 16);
        }
    );
    const {store} = useContext(Context);
    const navigate = useNavigate();

    const handleBeginDateChange = (event: any) => {
        setBeginDate(event.target.value);
    }
        const handleEndDateChange = (event: any) => {
        setEndDate(event.target.value);
    }
    const addVoting = async () => {
        const creator_id = store.user.id;
        if (title && description && category && begin_date && end_date) {
            await VotingService.addVoting({
                title,
                description,
                category,
                type,
                creator_id,
                begin_date: new Date(begin_date),
                end_date: new Date(end_date)
            });
        }
    }

    return (
        <div className="add-voting-page">
            <div className={"add-voting-form"}>
                <div className={"title"}>Add Voting</div>
                <input placeholder="Title" className="title" value={title}
                       onChange={(e) => setTitle(e.target.value)}/>
                <textarea placeholder="description" className="description" value={description}
                          onChange={(e) => setDescription(e.target.value)}/>
                <div className={"category"}>
                    <input placeholder="category" className="category" value={category}
                           onChange={(e) => setCategory(e.target.value)}/>
                    <select className={"selector"} id="choice" value={type}
                            onChange={(e) => setType(e.target.value)}>
                        <option value="default">default</option>
                        <option value="anonymous">anonymous</option>
                    </select>
                </div>
                <div className={"date-text"}>Begin date:</div>
                <input
                    type="datetime-local"
                    value={begin_date}
                    onChange={handleBeginDateChange}
                />
                <div className={"date-text"}>End date:</div>
                <input
                    type="datetime-local"
                    value={end_date}
                    onChange={handleEndDateChange}
                />
                <button className={"add-button"} onClick={async () => {
                    await addVoting();
                    navigate("/votings");
                }}>Add
                </button>
            </div>
        </div>
    );
};

export default AddVoting;
