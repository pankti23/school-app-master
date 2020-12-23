import React, { useRef, useState } from "react";
import "./DeleteRenameGradeSystemModal.css";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";
import { removeGradingSystem } from "../../../../../services/gradingSystemsService";

const DeleteRenameGradeSystemModal = (props) => {
  const {
    toggleDeleteRenameModal,
    leftPositionForModal,
    toggleDisplayTextBox,
    loadData,
    toggleDeleteConfirmationModal
  } = props;
  const ref = useRef();

  useOutsideClick(toggleDeleteRenameModal, ref);

  const handleDeleteClick = () => {
    toggleDeleteConfirmationModal();
  };

  return (
    <div
      className="delete-rename-grade-system-container"
      ref={ref}
      style={{ left: leftPositionForModal }}
    >
      <div
        role="button"
        tabIndex={0}
        className="grade-system-delete-button"
        onClick={handleDeleteClick}
      >
        <p className="delete-rename-grade-system-text">Delete</p>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="grade-system-rename-button"
        onClick={toggleDisplayTextBox}
      >
        <p className="delete-rename-grade-system-text">Rename</p>
      </div>
    </div>
  );
};

export default DeleteRenameGradeSystemModal;
