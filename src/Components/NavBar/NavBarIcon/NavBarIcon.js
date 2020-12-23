import React from "react";

import "./NavBarIcon.css";

const NavBarIcon = ({ image, status }) => {
  return (
    <div>
      {status === "active" ? (
        <img
          alt="icon"
          // style={{ backgroundColor: "red" }}
          className="navbar-icon"
          src={image}
        />
      ) : (
        <img alt="icon" className="navbar-icon" src={image} />
      )}
    </div>

  );
};

export default NavBarIcon;
