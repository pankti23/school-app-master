import React from "react";

import ManageSubjectsButton from "../ManageSubjectsButton/ManageSubjectsButton";
import { useDict } from "../../../../UI/Translations";

import "./SubjectManagerHeader.css";

const SubjectManagerHeader = (props) => {
  const { toggleManageSubjectsModal } = props;

  const dict = useDict("/configuration-page/subjects");

  return (
    <div className="subject-config-manager-header">
      <div className="subject-config-manager-text">
        {dict("manager/header/title")}
      </div>

      <ManageSubjectsButton
        toggleManageSubjectsModal={toggleManageSubjectsModal}
      />
    </div>
  );
};

export default SubjectManagerHeader;
