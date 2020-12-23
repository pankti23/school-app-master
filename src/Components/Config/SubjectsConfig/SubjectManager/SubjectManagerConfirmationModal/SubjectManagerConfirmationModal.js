import React from "react";

import Button from "../../../../UI/Button";
import Modal2 from "../../../../UI/Modal2";
import { useDict } from "../../../../UI/Translations";

import "./SubjectManagerConfirmationModal.css";

const SubjectManagerConfirmationModal = (props) => {
  const {
    displayConfirmationModal,
    errorMessage,
    handleCancelButtonClick,
    handleConfirmButtonClick,
    selected
  } = props;

  const dict = useDict("/configuration-page/subjects");

  return (
    <Modal2
      displayModal={displayConfirmationModal}
      handleClose={handleCancelButtonClick}
    >
      <div className="extracurricular-group-delete-modal-container">
        <div
          className="extracurricular-group-delete-modal-top-container"
          style={{ textAlign: "left" }}
        >
          <span className="extracurricular-group-delete-modal-top-text">
            {selected === 1
              ? dict("manager/delete-modal/confirmation")[0]
              : dict("manager/delete-modal/confirmation")[1]}
          </span>

          {errorMessage !== "" && (
            <div className="extracurricular-group-delete-modal-top-error-container">
              <span className="extracurricular-group-delete-modal-top-error-text">
                {dict("manager/delete-modal/message/error")}
              </span>

              <span className="extracurricular-group-delete-modal-top-error-text">
                {errorMessage}
              </span>
            </div>
          )}
        </div>

        <div className="extracurricular-group-delete-modal-divider" />

        <div className="extracurricular-group-delete-modal-bottom-container">
          <Button
            color="white"
            onClick={handleCancelButtonClick}
            size="medium"
            style={{ marginRight: "8px" }}
            width="70px"
          >
            <span className="extracurricular-group-delete-modal-bottom-cancel-button-text">
              {dict("manager/delete-modal/button/cancel")}
            </span>
          </Button>

          <Button
            color="green"
            onClick={handleConfirmButtonClick}
            size="medium"
            width="70px"
          >
            <span className="extracurricular-group-delete-modal-bottom-confirm-button-text">
              {dict("manager/delete-modal/button/confirm")}
            </span>
          </Button>
        </div>
      </div>
    </Modal2>
  );
};

export default SubjectManagerConfirmationModal;
