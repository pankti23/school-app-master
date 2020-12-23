import React from "react";
import "./MobileMain.css"
import NavBarConfig from "./NavBarConfig/NavBarConfig";
import { Switch, Route } from "react-router-dom";
import SchoolInfo from './SchoolInfo';
import Yearbook from "./Yearbook";
const MobileMain = () => {

  return (
    <div className="mobile-main">
      {/* this will show what is the current page*/}
      <div className="mobile-config-navbar">
        <NavBarConfig />
      </div>

      <div className="mobile-config-wrapper">
        <Switch>
          <Route exact path="/mobile/school-info">
            <SchoolInfo />
          </Route>

          <Route exact path="/mobile/yearbook">
            <Yearbook />
          </Route>

{/*
          <Route path="/mobile">
            <Yearbook />
          </Route>
*/}
        </Switch>
      </div>
    </div>
  );
};

export default MobileMain;
