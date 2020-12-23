import React, { useState, useRef } from "react";
import "./AddGradeSystemButton.css";
import AddGradeSystemModal from "../../GradeSystemConfigModals/AddGradeSystemModal/AddGradeSystemModal";

import Button from "../../../../UI/Button";
import { useDict } from "../../../../UI/Translations";

const AddGradeSystemButton = (props) => {
  const { campusId, loadData } = props;
  const [displayAddGradeSystemModal, setDisplayAddGradeSystemModal] = useState(
    false
  );

  const dict = useDict("/configuration-page/grade-system");

  const closeModal = () => {
    setDisplayAddGradeSystemModal(false);
  };

  const displayGradeSystemModel = () => {
    setDisplayAddGradeSystemModal(true);
  };

  return (
    <div>
      {displayAddGradeSystemModal ? (
        <div
          className="add-grade-system-modal-wrapper"
          style={
            displayAddGradeSystemModal
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <AddGradeSystemModal
            campusId={campusId}
            closeModal={closeModal}
            loadData={loadData}
          />
        </div>
      ) : null}

      <Button
        color="green"
        onClick={displayGradeSystemModel}
        size="medium"
        style={{ borderRadius: "6px" }}
      >
        <span className="extracurricular-campus-header-add-button-text">
          {dict("main/add-system-button")}
        </span>
      </Button>
    </div>
  );
};

export default AddGradeSystemButton;
