import React from "react";

import CheckGreenIcon from "../../../../../SchoolAPP Assets/check-green.svg";
import SubjectManagerConfirmationModal from "../SubjectManagerConfirmationModal";
import UncheckedIcon from "../../../../../SchoolAPP Assets/unchecked.svg";
import { Link } from "react-router-dom";
import { removeSubject } from "../../../../../services/subjectService";
import { useDict } from "../../../../UI/Translations";

import "./SubjectManagerTableRow.css";

const SubjectManagerTableRow = (props) => {
  const {
    checked,
    index,
    selectAll,
    setChecked,
    setSelectAll,
    setUncheckAll,
    subject,
    subjectTeacherCounts,
    uncheckAll,
    loadData,
    id
  } = props;

  const [
    displayConfirmationModal,
    setDisplayConfirmationModal
  ] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");

  const dict = useDict("/configuration-page/subjects");

  const teachers = subjectTeacherCounts[id] ?? 0;

  const handleChecked = () => {
    if (teachers === 0) {
      if (checked) {
        setChecked(index, false);
      } else {
        setChecked(index, true);
      }

      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  React.useEffect(() => {
    if (uncheckAll) {
      setChecked(index, false);
      setUncheckAll(false);
    }
  }, [uncheckAll, setUncheckAll]);

  const handleRemove = async (id) => {
    const deleteSubject = async () => {
      const deleteResponse = await removeSubject(id);

      if (deleteResponse.status === 200) {
        loadData();
        setSelectAll(false);
        setDisplayConfirmationModal(false);
      }
    };

    try {
      deleteSubject();
    } catch (e) {
      setErrorMessage(
        `${dict("manager/table/message/error/api")} ${e.status}.`
      );
    }
  };

  return (
    <tr className="subject-config-manager-table-rows-row">
      <td className="subject-config-manager-table-rows-checkbox-cell">
        <div className="subject-config-manager-table-rows-checkbox-cell-container">
          {checked || false ? (
            <img
              alt="green check"
              className={
                teachers > 0 ? "checked-box-icon-no-hover" : "checked-box-icon"
              }
              onClick={handleChecked}
              src={CheckGreenIcon}
              style={teachers > 0 ? { opacity: "0.25" } : {}}
            />
          ) : (
            <img
              alt="unchecked"
              className={
                teachers > 0
                  ? "unchecked-box-icon-no-hover"
                  : "unchecked-box-icon"
              }
              onClick={handleChecked}
              src={UncheckedIcon}
              style={teachers > 0 ? { opacity: "0.25" } : {}}
            />
          )}
        </div>
      </td>

      <td className="subject-config-manager-table-rows-subject-cell">
        <span className="subject-config-manager-table-rows-subject-cell-text">
          {subject}
        </span>
      </td>

      <td className="subject-config-manager-table-rows-teachers-cell">
        <Link to="/configuration-page/teachers">
          <button className="subject-config-manager-table-buttons subject-config-manager-table-rows-teachers-cell-button">
            <span className="subject-config-manager-table-rows-teachers-cell-text">
              {teachers}{" "}
              {teachers === 1
                ? dict("manager/table/teachers")[0]
                : dict("manager/table/teachers")[1]}{" "}
              ->
            </span>
          </button>
        </Link>
      </td>

      <td className="subject-config-manager-table-rows-remove-cell">
        <button
          className={
            "subject-config-manager-table-buttons subject-config-manager-table-rows-remove-cell-button" +
            (teachers > 0 ? " no-hover" : "")
          }
          disabled={teachers > 0}
          onClick={() => setDisplayConfirmationModal(true)}
          style={teachers > 0 ? { opacity: "0.25" } : {}}
        >
          <span className="subject-config-manager-table-rows-remove-cell-text">
            {dict("manager/table/remove-button")}
          </span>
        </button>

        <SubjectManagerConfirmationModal
          displayConfirmationModal={displayConfirmationModal}
          errorMessage={errorMessage}
          handleCancelButtonClick={() => setDisplayConfirmationModal(false)}
          handleConfirmButtonClick={() => handleRemove(id)}
          selected={1}
        />
      </td>
    </tr>
  );
};

export default SubjectManagerTableRow;
