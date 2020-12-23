import React, { useState, useEffect } from "react";
import "./GradingSystemConfigTableRow.css";

import { useDict } from "../../../../../UI/Translations";

const GradingSystemConfigTableRow = (props) => {
  const { currentGrade, gradeSystemId, updateGradeStatusRow } = props;
  const { grade } = currentGrade;

  const [currentGradeRowData, setCurrentGradeRowObjData] = useState({});

  const dict = useDict("/configuration-page/grade-system");

  useEffect(() => {
    setCurrentGradeRowObjData(currentGrade);
  }, []);

  const handleChange = (event) => {
    const newGradeRowData = {
      ...currentGradeRowData,
      status: parseInt(event.target.value)
    };
    setCurrentGradeRowObjData(newGradeRowData);
    updateGradeStatusRow(newGradeRowData);
  };

  return (
    <div
      className={`grading-system-config-row ${
        currentGrade.status == 2
          ? "grading-system-config-pass"
          : "grading-system-config-fail"
      }`}
    >
      <div className="grading-system-config-grade-column">
        <p className="grading-system-config-grade-column-text">{grade}</p>
      </div>
      <div className="grading-system-config-status-column">
        <label className="custom-radio-button-container">
          <p
            className={`grading-system-config-status-column-text${
              currentGrade.status === 2 ? "-selected" : ""
            }`}
          >
            {dict("grade-system/table/radio-button/fail")}
          </p>
          <input
            type="radio"
            checked={currentGrade.status === 1 ? "checked" : null}
            name={`pass-fail-${grade}-${gradeSystemId}`}
            value={1}
            onChange={handleChange}
          />
          <span className="custom-radio-button-checkmark"></span>
        </label>
        <label
          style={{ marginLeft: "20px" }}
          className="custom-radio-button-container"
        >
          <p
            className={`grading-system-config-status-column-text${
              currentGrade.status === 2 ? "-selected" : ""
            }`}
          >
            {dict("grade-system/table/radio-button/pass")}
          </p>
          <input
            type="radio"
            checked={currentGrade.status === 2 ? "checked" : null}
            name={`pass-fail-${grade}-${gradeSystemId}`}
            value={2}
            onChange={handleChange}
          />
          <span className="custom-radio-button-checkmark"></span>
        </label>
      </div>
    </div>
  );
};

export default GradingSystemConfigTableRow;
