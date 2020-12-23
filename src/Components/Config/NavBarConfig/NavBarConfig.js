import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDict } from "../../UI/Translations";

import "./NavBarConfig.css";

const NavBarConfig = () => {
  const dict = useDict("/configuration-page/navbar");

  const { pathname } = useLocation();

  return (
    <div className="NavBarConfig">
      <div className="config-navbar-container">
        <div className="NavBarHeader">
          <h1 style={{ fontWeight: "500" }}>{dict("title")}</h1>
        </div>
        <nav className="config-navbar-links">
          <Link to="/configuration-page/school">
            <li
              className={
                pathname.includes("/configuration-page/school")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/school")}
            </li>
          </Link>

          <Link to="/configuration-page/grade-system">
            <li
              className={
                pathname.includes("/configuration-page/grade-system")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/grade-system")}
            </li>
          </Link>

          <Link to="/configuration-page/subjects">
            <li
              className={
                pathname.includes("/configuration-page/subjects")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/subjects")}
            </li>
          </Link>

          <Link to="/configuration-page/admin-staff">
            <li
              className={
                pathname.includes("/configuration-page/admin-staff")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/admin-staff")}
            </li>
          </Link>

          <Link to="/configuration-page/teachers">
            <li
              className={
                pathname.includes("/configuration-page/teachers")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/teachers")}
            </li>
          </Link>

          <Link to="/configuration-page/extracurricular">
            <li
              className={
                pathname.includes("/configuration-page/extracurricular")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {dict("links/extracurricular")}
            </li>
          </Link>

          <Link to="/configuration-page/permissions">
            <li
              className={
                pathname.includes("/configuration-page/permissions")
                  ? "config-navbar-current-page"
                  : null
              }
            >
              {" "}
              {dict("links/permissions")}
            </li>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBarConfig;
