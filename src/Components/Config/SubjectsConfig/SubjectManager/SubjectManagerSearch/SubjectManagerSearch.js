import React from "react";

import SearchIcon from "../../../../../SchoolAPP Assets/search.svg";
import { useDict } from "../../../../UI/Translations";

import "./SubjectManagerSearch.css";

const SubjectManagerSearch = () => {
  const dict = useDict("/configuration-page/subjects");

  return (
    <div className="subject-config-manager-search">
      <img alt="icon" className="subject-config-search-icon" src={SearchIcon} />

      <input
        className="subject-config-manager-input-field"
        type="text"
        placeholder={dict("manager/table/search-placeholder")}
      />
    </div>
  );
};

export default SubjectManagerSearch;
