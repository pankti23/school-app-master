import React from "react";
import "./AddGradeSystemModal.css";
import { createGradingSystem } from "../../../../../services/gradingSystemsService";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";

import Button from "../../../../UI/Button";
import { useDict } from "../../../../UI/Translations";

const AddGradeSystemModal = (props) => {
  const { campusId, closeModal, loadData } = props;

  const [errorMessage, serErrorMessage] = React.useState("");

  const [gradeSystemData, setGradeSystemData] = React.useState({
    name: "",
    campusId: campusId,
    gradingSystemId: ""
  });

  const dict = useDict("/configuration-page/grade-system");

  const ref = React.useRef(null);

  const handleChange = (event) => {
    const newGradeSystemData = {
      ...gradeSystemData,
      [event.target.name]: event.target.value
    };
    setGradeSystemData(newGradeSystemData);
  };

  const handleCloseClick = () => {
    resetNewGradeSystemData();
    closeModal();
  };

  const handleCreateClick = React.useCallback(async () => {
    if (!gradeSystemData.name || !gradeSystemData.gradingSystemId) {
      alert("Please enter a name and select a grading system");
    } else {
      await createGradingSystem(gradeSystemData);
      resetNewGradeSystemData();
      closeModal();
      loadData();
    }
  }, [closeModal, gradeSystemData, loadData]);

  const handleKeypress = React.useCallback(() => {
    const onKeypress = (e) => {
      if (e.key === "Enter") handleCreateClick();
    };

    window.addEventListener("keydown", onKeypress);

    return () => {
      window.removeEventListener("keydown", onKeypress);
    };
  }, [handleCreateClick]);

  const resetNewGradeSystemData = () => {
    setGradeSystemData({
      name: "",
      campusId: "",
      gradingSystemId: ""
    });
  };

  useOutsideClick(() => {
    resetNewGradeSystemData();
    closeModal();
  }, ref);

  React.useEffect(handleKeypress, [handleKeypress]);

  return (
    <div className="add-grade-system-modal-container" ref={ref}>
      <p className="add-grade-system-modal-header-text">
        {dict("grade-system/add-modal/title")}
      </p>

      <div className="grey-line"></div>

      <p className="add-grade-system-form-text-header add-grade-system-form-text-header-spacing">
        {dict("grade-system/add-modal/input-text")}
      </p>

      <input
        className="add-grade-system-create-name-input-box"
        type="text"
        value={gradeSystemData.name}
        onChange={handleChange}
        name="name"
        placeholder={dict("grade-system/add-modal/input-text")}
      />

      <p className="add-grade-system-form-text-header add-grade-system-form-text-header-spacing">
        {dict("grade-system/add-moda/system/title")}
      </p>

      <div className="add-grade-system-custom-radio-buttons-container">
        <label className="custom-radio-button-container">
          <p className="add-grade-system-form-text-header ">
            {dict("grade-system/add-modal/system/radio-button/number")}
          </p>

          <input
            type="radio"
            name="gradingSystemId"
            onChange={handleChange}
            value={1}
            checked={gradeSystemData.gradingSystemId === "1"}
          />

          <span className="custom-radio-button-checkmark-grade-system custom-radio-button-checkmark"></span>
        </label>

        <label className="custom-radio-button-container">
          <p className="add-grade-system-form-text-header">
            {dict("grade-system/add-modal/system/radio-button/alphabet")}
          </p>

          <input
            type="radio"
            name="gradingSystemId"
            onChange={handleChange}
            value={2}
            checked={gradeSystemData.gradingSystemId === "2"}
          />

          <span className="custom-radio-button-checkmark-grade-system custom-radio-button-checkmark"></span>
        </label>
      </div>

      <div className="grey-line" style={{ marginTop: "30px" }}></div>

      <div className="modal-buttons">
        <Button
          size="default"
          color="white"
          margin="0 8px 0 0"
          onClick={handleCloseClick}
          width="70px"
        >
          <span style={{ fontWeight: "600" }}>
            {dict("grade-system/add-modal/button/cancel")}
          </span>
        </Button>

        <Button
          size="default"
          color="green"
          onClick={handleCreateClick}
          width="70px"
        >
          <span style={{ fontWeight: "600" }}>
            {dict("grade-system/add-modal/button/create")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default AddGradeSystemModal;
