import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header'
import Home from './components/home/home'
import Store from "./store/store";
import {createContext} from "react";
import App from "./App";
import {createRoot} from "react-dom/client";
import LoginForm from "./components/login/LoginForm";
import VotingPage from "./components/voting/VotingPage";
import ManageVotings from "./components/manage/ManageVotings";
import AddVoting from "./components/add-voting/AddVoting";

interface State {
    store: Store
}

const store = new Store();

export const Context = createContext<State>({
    store,
});

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <Router>
            <React.StrictMode>
                <Header/>
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/register" element={<LoginForm/>}/>
                    <Route path="/voting/:id" element={<VotingPage/>}/>
                    <Route path="/votings" element={<ManageVotings/>}/>
                    <Route path="/voting/add" element={<AddVoting/>}/>
                </Routes>
            </React.StrictMode>
        </Router>
    );
} else {
    console.error('Root element not found');
}