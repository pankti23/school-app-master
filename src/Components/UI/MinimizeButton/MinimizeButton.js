import React from "react";

import MinimizeIcon from "../../../SchoolAPP Assets/Minimize.svg";
import PlusIcon from "../../../SchoolAPP Assets/BlackPlus";
import { useDict } from "../Translations";

import "./MinimizeButton.css";

const MinimizeButton = (props) => {
  const { disable, handleClick, minimized, style } = props;

  const dict = useDict("/ui");

  return (
    <button
      className="minimize-button"
      onClick={() => {
        if (!disable) handleClick();
      }}
      style={{
        backgroundColor: style && style.bgcolor ? style.bgcolor : "#ffffff"
      }}
    >
      <div className="minimize-button-container">
        {!minimized ? (
          <img
            alt="minimize-icon"
            src={MinimizeIcon}
            style={{ minWidth: "12px" }}
          />
        ) : (
          <PlusIcon
            fill="#000000"
            width="13px"
            height="13px"
            stroke="none"
            style={{ minWidth: "13px" }}
          />
        )}

        <div className="minimize-button-text-container">
          <span className="minimize-button-text">
            {!minimized
              ? dict("minimize-button/minimize")
              : dict("minimize-button/open")}
          </span>
        </div>
      </div>
    </button>
  );
};

export default MinimizeButton;
