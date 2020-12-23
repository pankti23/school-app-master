import React from "react";
import "./GradeSystemMinimized.css";
import GradeSystemOpenButton from "./GradeSystemOpenButton/GradeSystemOpenButton";

import MinimizeButton from "../../../UI/MinimizeButton";

const GradeSystemMinimized = (props) => {
  const { campusName, minimized, toggleMinimizedState } = props;

  return (
    <div className="grade-system-minimized-container">
      <div className="grade-system-minimized-header-text">
        <span
          className="grade-system-minimized-header-title"
          style={{ marginRight: "10px" }}
        >
          {campusName}
        </span>
      </div>

      <MinimizeButton
        handleClick={toggleMinimizedState}
        minimized={minimized}
        style={{ bgcolor: "transparent" }}
      />
    </div>
  );
};

export default GradeSystemMinimized;
