import React, {useContext, useEffect} from "react";
import { Switch, Route, useLocation} from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Login from "../Login/Login";
import ForgotPassword from "../Login/ForgotPassword";
import CreatePassword from "../Login/CreatePassword";
import ResetPassword from "../Login/ResetPassword";
import StaffMain from "../Staff/StaffMain";
import Scores from "../Scores";
import PrivacyPolicy from "../Legal/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../Legal/TermsOfService/TermsOfService";
import "./HomePage.css";
import StudentsMain from "../Students/StudentsMain";
import ConfigMain from "../Config/ConfigMain";
import { UserContext } from "../../Contexts/UserContext";

import Calendar from "../Calendar";
import MobileMain from "../Mobile/MobileMain";

import { UnauthorizedUser } from "../ErrorPages";

import ProtectedRoute from "./ProtectedRoute";
import {isUserLoggedIn} from "../../services/authService";

const HomePage = () => {
  const userState = useContext(UserContext);
  let location = useLocation();
  let { pathname } = location;

  useEffect(() => {
    async function authenticate() {
      const user = await isUserLoggedIn();
      if (!user) {
        userState.logout();
      } else {
        userState.login(user);
      }
    }

    authenticate();
  }, [userState.isLoggedIn]);

  return (
    <div className="HomePage">
      <div className="body-homepage-wrapper">
        <Switch>
          <Route exact path="/privacy-policy">
            <PrivacyPolicy />
          </Route>

          <Route exact path="/terms-and-conditions">
            <TermsOfService />
          </Route>

          <Route exact path="/">
            <Login />
          </Route>

          <Route exact path="/activate">
            <CreatePassword />
          </Route>

          <Route exact path="/forgot-password">
            <ForgotPassword />
          </Route>

          <Route exact path="/reset-password">
            <ResetPassword />
          </Route>

          <Route exact path="/unauthorized">
            <UnauthorizedUser />
          </Route>

          <ProtectedRoute exact path="/calendar" component={Calendar} />
          <ProtectedRoute exact path="/staff-members-page" component={StaffMain} />
          <ProtectedRoute exact path="/students-page" component={StudentsMain} />
          <ProtectedRoute exact path="/scores-page" component={Scores} />
          <ProtectedRoute exact path="/configuration-page/:currentPage" component={ConfigMain} />
          <ProtectedRoute exact path="/mobile/:currentPage" component={MobileMain} />

        </Switch>
      </div>

      <div
        className="navbar-homepage-wrapper"
        style={userState.isLoggedIn && pathname !== '/activate' ? null : { display: "none" }}
      >
        {userState.isLoggedIn && !(userState.roleId > 3 && !userState.campusId) && pathname !== '/activate' ? <NavBar /> : null}
      </div>

    </div>
  );
};

export default HomePage;
