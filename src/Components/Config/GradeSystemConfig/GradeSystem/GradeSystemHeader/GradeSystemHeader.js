import React, { useState, useEffect } from "react";
import "./GradeSystemHeader.css";
import GradeSystemMinimizeButton from "../GradeSystemMinimizeButton/GradeSystemMinimizeButton";
import DeleteRenameGradeSystemModal from "../../GradeSystemConfigModals/DeleteRenameGradeSystemModal/DeleteRenameGradeSystemModal";
import DeleteConfirmationModal from "../../GradeSystemConfigModals/DeleteConfirmationModal/DeleteConfirmationModal";
import { FaCheck, FaTimes } from "react-icons/fa";
import { updateGradingSystem } from "../../../../../services/gradingSystemsService";
import DotsIcon from "../../../../../SchoolAPP Assets/DotsHorizontal";

import Dropdown from "../../../../UI/Dropdown";
import MinimizeButton from "../../../../UI/MinimizeButton";

import { useDict } from "../../../../UI/Translations";

const GradeSystemHeader = (props) => {
  const {
    campusId,
    campusName,
    minimized,
    toggleMinimizedState,
    gradeSystem,
    loadData
  } = props;

  const [displayDeleteRenameModal, setDisplayDeleteRenameModal] = useState(
    false
  );
  const [displayTextBox, setDisplayTextBox] = useState(false);
  const [
    displayDeleteConfirmationModal,
    setDisplayDeleteConfirmationModal
  ] = useState(false);
  const [gradeSystemData, setGradeSystemData] = useState({});
  const [leftPositionForModal, setLeftPositionForModal] = useState("");

  const dict = useDict("/configuration-page/grade-system");

  const editDropdownItems = [
    {
      onClick: () => setDisplayTextBox(!displayTextBox),
      value: dict("grade-system/edit-dropdown/rename")
    },
    {
      onClick: () =>
        setDisplayDeleteConfirmationModal(!displayDeleteConfirmationModal),
      value: dict("grade-system/edit-dropdown/delete")
    }
  ];

  const handleChange = (event) => {
    const newGradeSystemData = {
      ...gradeSystemData,
      [event.target.name]: event.target.value
    };
    // setCurrentGradeSystemName(event.target.value)
    setGradeSystemData(newGradeSystemData);
  };

  const handleCancelClick = () => {
    setGradeSystemData(gradeSystem);

    setDisplayTextBox(!displayTextBox);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") renameGradeSystem();
  };

  useEffect(() => {
    // setCurrentGradeSystemName(gradeSystemName)
    setGradeSystemData(gradeSystem);
  }, []);

  const toggleDeleteRenameModal = (newState = !displayDeleteRenameModal) => {
    getLeftPosition();
    setDisplayDeleteRenameModal(newState);
  };

  const toggleDeleteConfirmationModal = () => {
    setDisplayDeleteConfirmationModal(!displayDeleteConfirmationModal);
    setDisplayDeleteRenameModal(false);
  };

  const toggleDisplayTextBox = () => {
    setDisplayTextBox(!displayTextBox);
    setDisplayDeleteRenameModal(false);
  };

  const getLeftPosition = () => {
    const currentElement = document.getElementById(
      `grade-system-header-dots-${gradeSystem.id}`
    );
    const position = currentElement.getBoundingClientRect();
    setLeftPositionForModal(Math.round(position.left));
  };

  const renameGradeSystem = async () => {
    const renameResponse = await updateGradingSystem({
      id: gradeSystemData.id,
      name: gradeSystemData.name
    });

    if (renameResponse.id) {
      setDisplayTextBox(false);

      loadData();
    }
  };

  return (
    <div>
      {displayDeleteConfirmationModal ? (
        <div
          className="delete-confirmation-modal-wrapper"
          style={
            displayDeleteConfirmationModal
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <DeleteConfirmationModal
            toggleDeleteConfirmationModal={toggleDeleteConfirmationModal}
            gradeSystem={gradeSystem}
            loadData={loadData}
          />
        </div>
      ) : null}

      <div className="grade-system-header">
        <div className="grade-system-header-text">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <span
                className="grade-system-header-title"
                style={{ marginRight: "4px" }}
              >
                {campusName}
              </span>
              <div>
                <span
                  className="grade-system-header-title"
                  style={{ marginRight: "4px" }}
                >
                  >
                </span>
              </div>
            </div>
          </div>
          {displayTextBox ? (
            <div className="grade-system-rename-textbox-container">
              <input
                type="text"
                name={"name"}
                className="grade-system-rename-textbox-input section-header-input"
                value={gradeSystemData.name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />

              <button
                className="grade-system-rename-cancel-button"
                onClick={handleCancelClick}
              >
                <FaTimes size="16" />
              </button>

              <button
                className="grade-system-rename-save-button"
                onClick={renameGradeSystem}
              >
                <FaCheck size="16" />

                <span className="grade-system-rename-save-button-text">
                  {dict("grade-system/save-button")}
                </span>
              </button>
            </div>
          ) : (
            <div>
              {displayDeleteRenameModal ? (
                <Dropdown
                  closeDropdown={() => setDisplayDeleteRenameModal(false)}
                  dropdownItems={editDropdownItems}
                  id={`grade-system-header-dots-${gradeSystem.id}`}
                  style={{ fontSize: "14px", width: "190px" }}
                />
              ) : null}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="grade-system-header-title"
                  style={{ marginRight: "8px" }}
                >
                  {gradeSystemData.name}
                </span>
                <span
                  onClick={toggleDeleteRenameModal}
                  className="grade-system-header-dots"
                  id={`grade-system-header-dots-${gradeSystem.id}`}
                >
                  <DotsIcon
                    fill="#000000"
                    width="18px"
                    height="18px"
                    stroke="none"
                    style={{ cursor: "pointer", paddingTop: "4px" }}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
        <MinimizeButton
          handleClick={toggleMinimizedState}
          minimized={minimized}
          style={{ bgcolor: "transparent" }}
        />
      </div>
    </div>
  );
};

export default GradeSystemHeader;
