import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import "./Header.scss";

import { navigationItems } from '../../data/navigationItems.js';
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as ProfileIcon } from "../../icons/profile.svg";

import {useCommonState} from "../../data/commonState";

const Header = () => {
  const { isLoggedIn, isVisitor, setModalIdOpen, modalIdOpen, logout, clubLists } = useCommonState();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobile, setMobile] = useState(false);
  const location = useLocation();
  const [isProfileHovered, setProfileHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    return isMobile ? setMenuOpen(false) : null;
  };

  const profileBtn = () => {
    if (isLoggedIn) {
      setModalIdOpen("profile");
    } else {
      setModalIdOpen("login");
    }
  };

  const logoutBtn = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="header">
      <div className="header__container">
        <nav className="navigation">
          <div className="navigation__container">
            <div className="navigation__content">
                <NavLink to="/" title='Home'>
                  <Logo className="navigation__logo logo"></Logo>
                </NavLink>
            </div>
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <ul className={`navigation__items ${isMenuOpen ? 'open' : ''}`}>
                <li className='navigation__item' key="home">
                  <NavLink to="/" onClick={closeMenu} title='Home'>
                    <div className="navigation__link">
                      <span className='navigation__link--text'>Home</span>
                      <HomeIcon className="navigation__link--icon logo" />
                    </div>
                  </NavLink>
                </li>
              {navigationItems.map((item, index) => (
                <li className='navigation__item' key={index}>
                  <NavLink className={({ isActive }) =>
                    [
                      isActive || (item.link === '/clubs' && location.pathname.includes('/item')) ? "active" : "",
                      !isLoggedIn && !isVisitor ? "disabled" : "",
                      item.link === '/forums' && clubLists.length === 0 ? "hideForums" : ""
                    ].join(" ")}to={item.link} onClick={closeMenu} title={item.name}>
                    <div className="navigation__link">
                      <span className='navigation__link--text'>{item.name}</span>
                      {item.icon}
                    </div>
                  </NavLink>
                </li>
              ))}
              { (isLoggedIn || isVisitor) && <li className='navigation__item link--profile'>
                <button type="button" onClick={() => {}} className={`${modalIdOpen === 'profile' || isProfileHovered ? "active" : ""}`} title={isLoggedIn ? "Profile" : "Login"} onMouseEnter={() => setProfileHovered(true)}
                    onMouseLeave={() => setProfileHovered(false)} >
                  <div className="navigation__link">
                    <span className='navigation__link--text'>{isLoggedIn ? "PROFILE" : "LOGIN"}</span>
                    <ProfileIcon className="navigation__link--icon logo"/>
                  </div>
                </button>
                { isProfileHovered && (
                    <div className="mini-dialog" onMouseEnter={() => setProfileHovered(true)} onMouseLeave={() => setProfileHovered(false)} >
                      <ul>
                        <li>
                          <button type="button" onClick={profileBtn} className={`profile--link`}>{isLoggedIn ? "Profile" : "Login"}</button>
                        </li>
                        { isLoggedIn && <li>
                            <button type="button" onClick={logoutBtn} className={`logout--link`}>Log Out</button>
                          </li>
                        }
                      </ul>
                    </div>
                  )}
              </li>
              }
              <li className='navigation__item mobile'>
                <NavLink to="#" onClick={profileBtn} className={`profile--link`}>
                  <div className="navigation__link">
                    <span className='navigation__link--text'>{isLoggedIn ? "PROFILE" : "LOGIN"}</span>
                  </div>
                </NavLink>
              </li>
              { isLoggedIn && (
                  <li className='navigation__item mobile'>
                    <NavLink to="#" onClick={logoutBtn} className={`logout--link`}>
                      <div className="navigation__link">
                        <span className='navigation__link--text'>LOG OUT</span>
                      </div>
                    </NavLink>
                  </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Header;