import React, {FC, useContext, useEffect} from "react";
import "./styles/headForm.css";
import './styles/Logo.css';
import './styles/NavLink.css';
import {NavLink} from 'react-router-dom';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const Header: FC = () => {
    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            store.checkAuth();
        }
    }, []);

    return (
        <header
            className='headForm'>
            <div className={"Logo"}>
                <NavLink to="/home"></NavLink>
            </div>
            <div className={"NavigationLink"}>
                <NavLink to="/home"
                         className={navData => navData.isActive ? "Active" : ''}> Home </NavLink>
            </div>
            {store.isAuth ?
                <div className={"NavigationLink"}>
                    <NavLink to="/votings"
                             className={navData => navData.isActive ? "Active" : ''}> Manage </NavLink>
                </div>
                : <div/>}
            {!store.isAuth ?
                <div className={"AuthLinks"}>
                    <NavLink to="/login"
                             className={navData => navData.isActive ? "Active" : ''}> Sign in </NavLink>
                    <NavLink to="/register"
                             className={navData => navData.isActive ? "Active" : ''}> Sign up </NavLink>
                </div>
                :
                <div className={"AuthLinks"}>
                    <NavLink to="/profile"
                             className={navData => navData.isActive ? "Active" : ''}>{store.user.login}</NavLink>
                    <NavLink to="/login"
                             className={navData => navData.isActive ? "Active" : ''}
                             onClick={async () => {
                                 await store.logout()
                             }}> Log out </NavLink>
                </div>
            }
        </header>
    )
}

export default observer(Header);
