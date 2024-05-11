import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoHome, IoBuild, IoClipboard, IoLogOut } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const logout = () => {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    };

    return (
        <div >
            <aside className="menu pl-3 has-shadow" >
                <p className="menu-label mt-2 mb-1" style={{ fontSize: '16px' }} >Меню</p>
                <ul className="menu-list" style={{ height: 'calc(100vh - 300px)' }}>
                    
                    
                    <li>
                        <NavLink to={"/dashboard"} style={{ fontSize: '18px' }}><IoHome className="mr-2"/>Главная</NavLink>

                    </li>
                    <li>
                        <NavLink to={"/tools"} style={{ fontSize: '18px' }}><IoBuild className="mr-2"/>Инструменты</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/clients"} style={{ fontSize: '18px' }}><IoPerson className="mr-2"/>Клиенты</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/orders"} style={{ fontSize: '18px' }}><IoClipboard className="mr-2"/>Заказы</NavLink>
                    </li>
                </ul>

                {user && user.role === "admin" && (
                <div>
                <p className="menu-label mt-2 mb-1" style={{ fontSize: '16px' }}>Система</p>
                <ul className="menu-list">
                    <li>
                        <NavLink to={"/users"} style={{ fontSize: '18px' }} >Пользователи</NavLink>
                    </li> 
                </ul>
                </div>
                )}
                <p className="menu-label mb-1" style={{ fontSize: '16px' }}>Профиль</p>
                <ul className="menu-list">
                    <li style={{ marginTop: 'auto' }}>
                        <button onClick={logout} className="button is-grey">
                            <IoLogOut/>Выход
                        </button>
                    </li>
                </ul>
            </aside>
        </div>
    );
};

export default Sidebar;