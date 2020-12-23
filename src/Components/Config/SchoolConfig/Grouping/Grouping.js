import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Grouping.css";
import LinkIcon from "../../../../SchoolAPP Assets/external.svg";

const Grouping = ({ count, type, fullWidth, icon, link, linkText }) => {
  return (
    <div className="config-grouping-container">
      <div
        className={[
          "config-grouping",
          fullWidth ? "config-grouping-full-width" : ""
        ].join(" ")}
      >
        <div className="config-grouping-content">
          <img className="config-grouping-icon" src={icon} />
          <p>
            {count} {type}
          </p>
        </div>
        <Link to={link}>
          <div className="config-grouping-link">
            <p>{linkText}</p>
            <img className="config-grouping-icon" src={LinkIcon} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Grouping;
