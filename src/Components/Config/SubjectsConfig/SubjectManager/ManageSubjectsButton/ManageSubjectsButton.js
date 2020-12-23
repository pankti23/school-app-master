import React from "react";

import Button from "../../../../UI/Button";
import { useDict } from "../../../../UI/Translations";

import "./ManageSubjectsButton.css";

const ManageSubjectsButton = (props) => {
  const { toggleManageSubjectsModal } = props;

  const dict = useDict("/configuration-page/subjects");

  return (
    <Button color="grey" onClick={toggleManageSubjectsModal} size="medium">
      <span className="subject-config-manage-button-text">
        {dict("manager/header/manage-subjects-button")}
      </span>
    </Button>
  );
};

export default ManageSubjectsButton;
