import React from "react";

import { useDict } from "../../../UI/Translations";

import "./SubjectConfigHeader.css";

const SubjectConfigHeader = () => {
  const dict = useDict("/configuration-page/subjects");

  return (
    <div className="subject-config-header-container">
      <p className="subject-config-header">{dict("main/header-title")} </p>
      <p className="subject-config-paragraph">
        {dict("main/header-paragraph")}
      </p>
    </div>
  );
};

export default SubjectConfigHeader;
