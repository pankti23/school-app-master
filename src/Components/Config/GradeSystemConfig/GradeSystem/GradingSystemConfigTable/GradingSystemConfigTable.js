import React, { useState, useEffect } from "react";
import "./GradingSystemConfigTable.css";
import GradingSystemConfigTableRow from "./GradingSystemConfigTableRow/GradingSystemConfigTableRow";
import EditConfirmationModal from "../../GradeSystemConfigModals/EditConfirmationModal/EditConfirmationModal";
import LoadingSpinner from "../../../../UI/LoadingSpinner";

import Button from "../../../../UI/Button";
import { useDict } from "../../../../UI/Translations";

const GradingSystemConfigTable = (props) => {
  const { gradeSystem, loadData } = props;
  const [currentGradeSystem, setCurrentGradeSystem] = useState([]);
  const [
    displayEditConfirmationModal,
    setDisplayEditConfirmationModal
  ] = useState(false);
  const [loading, setLoading] = useState(false);

  const dict = useDict("/configuration-page/grade-system");

  useEffect(() => {
    // this is to sort the sequence
    setGradingSystem();
  }, []);

  const updateGradeStatusRow = (newGradeRowData) => {
    const currentSequenceNumber = newGradeRowData.sequence;
    const gradeIndex = currentGradeSystem.findIndex((grade) => {
      return grade.sequence === currentSequenceNumber;
    });
    let currentGradeSystemCopy = currentGradeSystem.slice();
    currentGradeSystemCopy.splice(gradeIndex, 1, newGradeRowData);

    setCurrentGradeSystem(currentGradeSystemCopy);
  };

  const displayGrade = currentGradeSystem.map((currentGrade, index) => {
    return (
      <GradingSystemConfigTableRow
        key={`${gradeSystem.name} ${gradeSystem.id + index}`}
        currentGrade={currentGrade}
        index={index}
        gradeSystemId={gradeSystem.id}
        updateGradeStatusRow={updateGradeStatusRow}
      />
    );
  });

  const toggleEditConfirmationModal = () => {
    setDisplayEditConfirmationModal(!displayEditConfirmationModal);
  };

  const toggleLoading = () => {
    setLoading(!loading);
  };

  const setGradingSystem = () => {
    const sortedGradeSystem = gradeSystem.Grades.sort((a, b) => {
      return a.sequence > b.sequence
        ? 1
        : a.sequence === b.sequence
        ? a.sequence > b.sequence
          ? 1
          : -1
        : -1;
    });

    setCurrentGradeSystem(sortedGradeSystem);
  };

  const cancelEditGradeSystem = () => {
    setGradingSystem();
    setDisplayEditConfirmationModal(false);
  };

  const updateSuccessful = () => {
    setLoading(false);
    setDisplayEditConfirmationModal(false);
  };

  return (
    <div>
      {displayEditConfirmationModal ? (
        <div
          className="edit-confirmation-modal-wrapper"
          style={
            displayEditConfirmationModal
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <EditConfirmationModal
              gradeSystemData={{ ...gradeSystem, Grades: currentGradeSystem }}
              loadData={loadData}
              cancelEditGradeSystem={cancelEditGradeSystem}
              toggleLoading={toggleLoading}
              updateSuccessful={updateSuccessful}
            />
          )}
        </div>
      ) : null}
      <div className="grading-system-config-table">
        <p className="grading-system-config-table-header">
          {dict("grade-system/title")}
        </p>
        <div className="grading-system-config-table-container">
          <div className="grading-system-config-header-row">
            <div className="grading-system-config-header-grade-column">
              <p>{dict("grade-system/table/column/grade")}</p>
            </div>
            <div className="grading-system-config-header-status-column">
              <p>{dict("grade-system/table/column/status")}</p>
            </div>
          </div>
          {displayGrade}
        </div>

        <Button
          color="grey"
          onClick={toggleEditConfirmationModal}
          size="medium"
          style={{ marginTop: "20px" }}
          width="100%"
        >
          <span className="school-info-school-info-save-button-text">
            {dict("grade-system/table/save-button")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default GradingSystemConfigTable;
