import React from "react";
import "./GradeConfigHeader.css";

import { useDict } from "../../../UI/Translations";

const GradeConfigHeader = () => {
  const dict = useDict("/configuration-page/grade-system");

  return (
    <div className="grade-config-header-container">
      <p className="grade-config-header">{dict("main/header/title")}</p>
      <p className="grade-config-paragraph">{dict("main/header/paragraph")}</p>
    </div>
  );
};

export default GradeConfigHeader;
