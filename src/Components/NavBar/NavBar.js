import React, { useState, useContext, useRef } from "react";
import "./NavBar.css";
import { Link, useLocation, Redirect } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import BookSVG from "../../SchoolAPP Assets/NavBarIcon";
import CalendarSVG from "../../SchoolAPP Assets/Calender";
import StaffSVG from "../../SchoolAPP Assets/StaffPageIcon";
import GradCapSVG from "../../SchoolAPP Assets/GraduationCap";
import GradesSVG from "../../SchoolAPP Assets/GradesIcon";
import DoubleCogSVG from "../../SchoolAPP Assets/DoubleCog";
import PhoneCogSVG from "../../SchoolAPP Assets/PhoneCog";
import SingleCog from "../../SchoolAPP Assets/SingleCog";
import LogoutAlternate from "../../SchoolAPP Assets/LogoutAlternate";
import { FaUserCircle } from "react-icons/fa";
import useOnClickOutside from "../../CustomHooks/useOnClickOutside";

import { logout } from "../../services/authService";
import { clearLocalStorage } from "../../services/localStorageService";

import UpdateUserInfoModal from "./UpdateUserInfoModal/UpdateUserInfoModal";

import { useDict } from "../UI/Translations";
import LoadingSpinner from "../UI/LoadingSpinner";

const NavBar = (props) => {
  const [logoutModal, setLogoutModal] = useState(false);
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [success, setSuccess] = useState(false)
  const activeColor = "#ffffff";
  const inactiveColor = "#717C95";

  const dict = useDict("/navbar");

  let location = useLocation();

  const userState = useContext(UserContext);

  const ref = useRef();
  useOnClickOutside(ref, () => setLogoutModal(false));
  
  const refSuccess = useRef();
  useOnClickOutside(refSuccess, () => setSuccess(false));

  const userInfoModalSwitch = () => {
    setLogoutModal(false);
    setUserInfoModal(!userInfoModal);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    userState.logout();
    clearLocalStorage();
    setLogoutModal(false);
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="navbar-main">
      {userInfoModal && !isLoading ? (
        <UpdateUserInfoModal setIsLoading={setIsLoading} closeModal={userInfoModalSwitch} setSuccess={setSuccess} />
      ) : null}
      {isLoading && <div className="user-info-modal-wrapper"><div className="user-save-success user-confirmation-loader"><LoadingSpinner /></div></div>}
      {success && !userInfoModal ? (
        <div className="user-info-modal-wrapper">
          <div ref={refSuccess} className="user-save-success">
            <h1 className="user-info-modal-heading">
              {dict("main/modal/success")}
            </h1>
          </div>
        </div>
      ) : null}
      <div className="navbar-wrapper">
        <div className="navbar-sub-wrapper">
          <div className="navbar-second-wrapper">
            <div className="navbar-section">
              <Link to="/calendar">
                <span>
                  <BookSVG
                    fill={activeColor}
                    stroke="none"
                    height="30px"
                    width="30px"
                    style={{ marginTop: "10px" }}
                  />
                </span>
              </Link>
            </div>

            <div className="navbar-section">
              <p>{dict("main/links/calendar")}</p>
              <Link to="/calendar">
                <CalendarSVG
                  fill={
                    location.pathname.includes("/calendar")
                      ? activeColor
                      : inactiveColor
                  }
                  stroke="none"
                  height="25px"
                  width="25px"
                  style={{ marginTop: "10px" }}
                />
              </Link>
            </div>

            <div className="navbar-section">
              <p>{dict("main/links/staff")}</p>
              <Link to="/staff-members-page">
                <span>
                  <StaffSVG
                    fill={
                      location.pathname.includes("/staff-members-page")
                        ? activeColor
                        : inactiveColor
                    }
                    stroke="none"
                    height="25px"
                    width="25px"
                    style={{ marginTop: "10px" }}
                  />
                </span>
              </Link>
            </div>

            <div className="navbar-section">
              <p>{dict("main/links/students")}</p>
              <Link to="/students-page">
                <span>
                  <GradCapSVG
                    fill={
                      location.pathname.includes("/students-page")
                        ? activeColor
                        : inactiveColor
                    }
                    stroke="none"
                    height="28px"
                    width="28px"
                    style={{ marginTop: "10px" }}
                  />
                </span>
              </Link>
              <Link to="/scores-page">
                <span>
                  <GradesSVG
                    fill={
                      location.pathname.includes("/scores-page")
                        ? activeColor
                        : inactiveColor
                    }
                    stroke="none"
                    height="25px"
                    width="25px"
                    style={{ marginTop: "10px" }}
                  />
                </span>
              </Link>
            </div>

            <div className="navbar-section">
              <p>{dict("main/links/configuration")}</p>
              <Link to="/configuration-page/school">
                <DoubleCogSVG
                  fill={
                    location.pathname.includes("/configuration-page")
                      ? activeColor
                      : inactiveColor
                  }
                  stroke="none"
                  height="30px"
                  width="30px"
                  style={{ marginTop: "10px" }}
                />
              </Link>
            </div>
            <div className="navbar-section">
              <p>{dict("main/links/mobile")}</p>
              <Link to="/mobile/school-info">
                <span>
                  <PhoneCogSVG
                    fill={
                      location.pathname.includes("/mobile")
                        ? activeColor
                        : inactiveColor
                    }
                    stroke="none"
                    height="25px"
                    width="25px"
                    style={{ marginTop: "10px" }}
                  />
                </span>
              </Link>
            </div>
            <div className="navbar-section">
              {/* this UserCirle Icon will be a placeholder*/}
              {userState.photo ? (
                <img
                  className="image-user-photo-navbar"
                  alt="profile"
                  src={userState.photo}
                  onClick={() => {
                    setLogoutModal(!logoutModal);
                  }}
                />
              ) : (
                <FaUserCircle
                  className="navbar-user-image"
                  onClick={() => {
                    setLogoutModal(!logoutModal);
                  }}
                />
              )}
            </div>
            <div
              ref={ref}
              className="logout-modal-container"
              style={logoutModal ? { display: "flex" } : { display: "none" }}
            >
              <div className="arrow bottom right"></div>
              <section className="logout-modal-top-wrapper">
                {userState.photo ? (
                  <img
                    className="image-user-photo"
                    alt="Profile"
                    src={userState.photo}
                  />
                ) : (
                  <FaUserCircle className="modal-user-image" />
                )}
                <article>
                  <p className="logout-name">{userState.name}</p>
                  <p className="logout-role">{userState.Role.name}</p>
                </article>
              </section>
              <div className="break-line-logout-modal"></div>
              <section
                className="logout-modal-middle-wrapper"
                onClick={userInfoModalSwitch}
              >
                <SingleCog
                  height="25px"
                  width="25px"
                  style={{}}
                  fill="#000000"
                  stroke="none"
                />
                <p>{dict("main/button/settings")}</p>
              </section>
              <div className="break-line-logout-modal"></div>
              <section
                className="logout-modal-bottom-wrapper"
                onClick={handleLogout}
              >
                <p>{dict("main/button/logout")}</p>
                <LogoutAlternate
                  height="20px"
                  width="20px"
                  style={{}}
                  fill="#000000"
                  stroke="none"
                />
              </section>
            </div>
          </div>
          <div className="navbar-bottom-wrapper">
          {/* <div className="navbar-user-image-wrapper">
            {userState.photo ? (
              <img
                className="image-user-photo-navbar"
                alt="profile"
                src={userState.photo}
                onClick={() => {
                  setLogoutModal(!logoutModal);
                }}
              />
            ) : (
              <FaUserCircle
                className="navbar-user-image"
                onClick={() => {
                  setLogoutModal(!logoutModal);
                }}
              />
            )}
          </div> */}
          
        </div>
        </div>       
      </div>
    </div>
  );
};

export default NavBar;
