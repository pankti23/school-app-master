import React, { useRef } from "react";
import "./DeleteConfirmationModal.css";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";
import { removeGradingSystem } from "../../../../../services/gradingSystemsService";

import Button from "../../../../UI/Button";
import { useDict } from "../../../../UI/Translations";

const DeleteConfirmationModal = (props) => {
  const { toggleDeleteConfirmationModal, gradeSystem, loadData } = props;
  const ref = useRef();

  const dict = useDict("/configuration-page/grade-system");

  useOutsideClick(toggleDeleteConfirmationModal, ref);

  const deleteGradingSystem = async (id) => {
    const deleteResponse = await removeGradingSystem(id);

    if (deleteResponse.status === 200) {
      toggleDeleteConfirmationModal(false);
      loadData();
    }
  };

  return (
    <div className="delete-confirmation-modal-container" ref={ref}>
      <p className="delete-confirmation-modal-header-text">
        {dict("grade-system/delete-modal/title")}
      </p>
      <div className="grey-line"></div>
      <div className="modal-buttons">
        <Button
          size="default"
          color="white"
          margin="0 8px 0 0"
          onClick={toggleDeleteConfirmationModal}
          width="70px"
        >
          <span style={{ fontWeight: "600" }}>
            {dict("grade-system/delete-modal/button/cancel")}
          </span>
        </Button>

        <Button
          size="default"
          color="green"
          onClick={() => deleteGradingSystem(gradeSystem.id)}
          width="70px"
        >
          <span style={{ fontWeight: "600" }}>
            {dict("grade-system/delete-modal/button/confirm")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
