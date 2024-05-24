import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/login/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";

const App: FC = () => {
    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            store.checkAuth()
            //store.addVoting("title", "description", "category", "default")
        }
    }, [store])

    if (store.isLoading) {
        console.log("loading: " + store.isLoading)
        return <div>Loading...</div>;
    }
    return (
        <div style={{backgroundColor: 'black'}}>
            <h1>{store.isAuth ? "Authorized user_id: " + store.user.login : "Not authorized"}</h1>
            <LoginForm/>
        </div>
    );
};

export default observer(App);