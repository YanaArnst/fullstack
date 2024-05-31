import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../logo.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
    setSearchQuery(''); // Очищаем поле поиска после перехода
  };
    
return (
    <div>
        <nav 
        className="navbar is-fixed-top has-shadow" 
        role="navigation" 
        aria-label="main navigation"
        style={{ backgroundColor: 'black' }}
        >
          <div className="navbar-brand">
            <NavLink to="/dashboard" className="navbar-item">
              <img 
              src={logo} 
              width="180" 
              height="80"
              alt="logo"
              />
            </NavLink>
        
            <a 
            href='!#' 
            role="button" 
            className="navbar-burger burger" 
            aria-label="menu" 
            aria-expanded="false" 
            data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
        
          <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
          <div className="navbar-item" style={{ marginLeft: '100px' }}>
              <form className="field has-addons" onSubmit={handleSearch}>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="control">
                  <button type="submit" className="button is-info">
                    Найти
                  </button>
                </div>
                </form>
              </div>
          </div>


            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button onClick={logout} className="button is-light">
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
    </div>
  );
};

export default Navbar;