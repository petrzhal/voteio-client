import React, {FC, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import "./styles/Participants.css"
import {User} from "../../models/User";
import {observer} from "mobx-react-lite";

interface ParticipantsProps {
    users: User[] | null;
}

const Participants : FC<ParticipantsProps>= ({users}) => {
    const {pos_id} = useParams();
    const position_id = parseInt(pos_id ? pos_id.toString() : "0", 10);
    return (
        <div>
            <div className={"participants-form"}>
                <h1>
                    Votes:
                </h1>
                <div className="participants-container">
                    {users?.map((user: User) => (
                        <div className={"participant"} key={user.id}>
                            {user.login}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default observer(Participants);