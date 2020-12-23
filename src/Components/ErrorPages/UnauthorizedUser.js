import React, {useContext, useEffect} from "react";
import './UnauthorizedUser.css';

import { logout } from "../../services/authService";
import { clearLocalStorage } from "../../services/localStorageService";
import {UserContext} from "../../Contexts/UserContext";

import { useDict } from "../UI/Translations"

const UnauthorizedUser = () => {
  const userState = useContext(UserContext);

  const dict = useDict("/configuration-page/unauthorized-user");
  
  useEffect(() => {
      document.body.classList.add('error-unauthorized-page');
      const logoutUser = async () => {
        await logout();
        userState.logout();
        clearLocalStorage();
      };
      let timer = setTimeout(() => {
        logoutUser();
      }, 5000);

      return () => {
        clearTimeout(timer);
        document.body.classList.remove('error-unauthorized-page');
      }
    }, []);

  return (
    <div className="error-pages-container">
      <h1 className="error-pages-header">{userState && userState.roleId && userState.roleId === 8 ? dict("error/parent") : dict("error/common")}</h1>
    </div>
  );
};

export default UnauthorizedUser;
