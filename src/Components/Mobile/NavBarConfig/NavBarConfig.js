import React from "react";
import "./NavBarConfig.css";
import { Link, useLocation } from "react-router-dom";
import { useDict } from "../../UI/Translations";

const NavBarConfig = () => {
  const { pathname } = useLocation();

  const dict = useDict("/mobile/navbar");

  return (
    <div className="NavBarConfig">
      <div className="config-navbar-container">
        <div className="NavBarHeader">
          <h1 style={{ fontWeight: "500" }}>{dict("title")}</h1>
        </div>
        <nav className="config-navbar-links">
          <Link to="/mobile/school-info">
            <li
              className={
                pathname.includes("/mobile/school-info")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/school-info")}
            </li>
          </Link>

          <Link to="/mobile/yearbook">
            <li
              className={
                pathname.includes("/mobile/yearbook")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/yearbook")}
            </li>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBarConfig;
