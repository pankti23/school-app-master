import React, { useState, useEffect } from "react";
import "./SubjectModalRow.css";
import CheckGreenIcon from "../../../../../SchoolAPP Assets/check-green.svg";
import UncheckedIcon from "../../../../../SchoolAPP Assets/unchecked.svg";
import TrashIcon from "../../../../../SchoolAPP Assets/delete-empty.svg";

const SubjectModalRow = props => {
  const { deleteSubject, name, isDefault, toggleRowCheck, checked } = props;

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(checked);
  }, []);

  const handleClick = () => {
    setIsChecked(!isChecked);
    toggleRowCheck(name, !isChecked);
  };

  const handleDelete = name => {
    deleteSubject(name);
  };

  return (
    <div className="subject-modal-row-wrapper">
      <div className="subject-modal-row-check-box-text" onClick={handleClick}>
        {checked ? (
          <img
            alt="green check"
            className="checked-box-icon"
            src={CheckGreenIcon}
          />
        ) : (
          <img
            alt="unchecked"
            className="unchecked-box-icon"
            src={UncheckedIcon}
          />
        )}

        <span
          className={`subject-modal-row-text ${!checked &&
            `subject-modal-row-text-unchecked`}`}
        >
          {name}
          {!isDefault && (
            <span className="subject-modal-row-custom-text"> (custom)</span>
          )}
        </span>
      </div>

      <div className="subject-modal-row-trash-container">
        {!isDefault && (
          <img
            alt="trash-icon"
            className="subject-modal-row-trash-icon"
            src={TrashIcon}
            onClick={() => handleDelete(name)}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectModalRow;
