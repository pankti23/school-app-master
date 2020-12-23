import React, { useRef } from "react";
import "./EditConfirmationModal.css";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";
import { updateGradingSystem } from "../../../../../services/gradingSystemsService";

import Button from "../../../../UI/Button";
import { useDict } from "../../../../UI/Translations";

const EditConfirmationModal = (props) => {
  const {
    updateSuccessful,
    toggleLoading,
    gradeSystemData,
    loadData,
    cancelEditGradeSystem
  } = props;
  const ref = useRef();

  const dict = useDict("/configuration-page/grade-system");

  const editGradingSystem = async (data) => {
    toggleLoading();
    const updateResponse = await updateGradingSystem(data);

    if (updateResponse) {
      updateSuccessful();
      loadData();
    }
  };

  const handleCancelButton = () => {
    cancelEditGradeSystem();
  };

  useOutsideClick(handleCancelButton, ref);

  return (
    <div className="edit-confirmation-modal-container" ref={ref}>
      <p className="edit-confirmation-modal-header-text">
        {dict("grade-system/edit-modal/title")}
      </p>
      <div className="grey-line"></div>
      <div className="modal-buttons">
        <Button
          size="default"
          color="white"
          margin="0 8px 0 0"
          onClick={handleCancelButton}
          width="70px"
        >
          <span style={{ fontWeight: "600" }}>
            {dict("grade-system/edit-modal/button/cancel")}
          </span>
        </Button>

        <Button
          size="default"
          color="green"
          onClick={() => editGradingSystem(gradeSystemData)}
          width="70px"
        >
          <span style={{ fontWeight: "600" }}>
            {dict("grade-system/edit-modal/button/confirm")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default EditConfirmationModal;
