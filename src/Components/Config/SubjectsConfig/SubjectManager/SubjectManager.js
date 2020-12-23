import React, { useState, useEffect } from "react";

import CheckGreenIcon from "../../../../SchoolAPP Assets/check-green.svg";
import ManageSubjectsModal from "../ManageSubjectsModal/ManageSubjectsModal";
import SearchIcon from "../../../../SchoolAPP Assets/search.svg";
import SubjectManagerConfirmationModal from "./SubjectManagerConfirmationModal";
import SubjectManagerHeader from "./SubjectManagerHeader/SubjectManagerHeader";
import SubjectManagerTableRow from "./SubjectManagerTableRow/SubjectManagerTableRow";
import UncheckedIcon from "../../../../SchoolAPP Assets/unchecked.svg";
import { Search } from "../../../UI/Search/Search";
import { removeSubject } from "../../../../services/subjectService";
import { useDict } from "../../../UI/Translations";

import "./SubjectManager.css";
import "./SubjectManagerSearch/SubjectManagerSearch.css";

const SubjectManager = (props) => {
  const { setSubjects, subjectTeachers, subjects, loadData } = props;

  const [displayManageSubjectsModal, setDisplaySubjectModal] = useState(false);

  const [
    displaySelectedConfirmationModal,
    setDisplaySelectedConfirmationModal
  ] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectAll, setSelectAll] = useState(false);

  const [uncheckAll, setUncheckAll] = useState(false);

  const [checkedArray, setCheckedArray] = useState([]);

  const [subjectTeacherCounts, setSubjectTeachersCounts] = useState({});

  const dict = useDict("/configuration-page/subjects");

  const search = Search(subjects);

  const selectedSubjectsCount = checkedArray
    .map((v) => (v ? 1 : 0))
    .reduce((a, b) => a + b, 0);

  const handleCheck = (index, bool) => {
    const arr = [];

    checkedArray.forEach((v) => arr.push(v));

    arr[index] = bool;

    setCheckedArray(arr);
  };

  const displaySubjectManagerTableRow = search.displayedContents ? (
    search.displayedContents.map((subject, index) => {
      return (
        <SubjectManagerTableRow
          checked={checkedArray[index]}
          key={index}
          index={index}
          selectAll={selectAll}
          setChecked={handleCheck}
          setSelectAll={setSelectAll}
          setUncheckAll={setUncheckAll}
          subject={subject.name}
          subjectTeacherCounts={subjectTeacherCounts}
          id={subject.id}
          teachers={subject.assignedTeachers}
          uncheckAll={uncheckAll}
          loadData={loadData}
        />
      );
    })
  ) : (
    <div />
  );

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      setCheckedArray(
        search.displayedContents.map(
          (subject) => (subjectTeacherCounts[subject.id] ?? 0) === 0
        )
      );
    } else {
      setUncheckAll(true);
      setSelectAll(false);
      setCheckedArray(checkedArray.map((v) => false));
    }
  };

  const handleSelectedRemove = () => {
    const tempCheckedArray = checkedArray.filter((v, i) => !v);

    const tempSubjects = subjects.filter((v, i) => !checkedArray[i]);

    setCheckedArray(tempCheckedArray);

    setSubjects(tempSubjects);

    setSelectAll(false);

    const idArray = subjects.filter((v, i) => checkedArray[i]).map((v) => v.id);

    const deleteSelectedSubjects = () => {
      idArray.forEach(async (id) => {
        const deleteResponse = await removeSubject(id);

        if (deleteResponse.status === 200) {
          loadData();
          setSelectAll(false);
          setDisplaySelectedConfirmationModal(false);
        }
      });
    };

    try {
      deleteSelectedSubjects();
    } catch (e) {
      setErrorMessage(`${dict("manager/message/error/api")} ${e.status}.`);
    }
  };

  const toggleManageSubjectsModal = (state) => {
    setDisplaySubjectModal(state);
  };

  React.useEffect(() => {
    search.setDisplayedContents(subjects);

    const arr = [];

    subjects.forEach((v, i) => {
      arr.push(false);
    });

    setCheckedArray(arr);
  }, [subjects]);

  useEffect(() => {
    search.search();
  }, [search]);

  useEffect(() => {
    const subjectTeacherObject = {};

    // key -> subject id, value -> teacher count
    subjectTeachers.forEach((subjectTeacher) => {
      
      subjectTeacherObject[subjectTeacher.subjectId] = subjectTeacherObject[
        subjectTeacher.subjectId
      ]
        ? subjectTeacherObject[subjectTeacher.subjectId] + 1
        : 1;
    });

    setSubjectTeachersCounts(subjectTeacherObject);
  }, [subjectTeachers]);

  return (
    <div>
      {displayManageSubjectsModal ? (
        <div
          className="modal-wrapper"
          style={
            displayManageSubjectsModal
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <ManageSubjectsModal
            loadData={loadData}
            subjects={subjects}
            toggleManageSubjectsModal={toggleManageSubjectsModal}
          />
        </div>
      ) : null}

      <div className="subject-config-manager">
        <SubjectManagerHeader
          toggleManageSubjectsModal={toggleManageSubjectsModal}
        />
        <div className="subject-config-manager-table-wrapper">
          <table className="subject-config-manager-table">
            <thead>
              <tr className="subject-config-manager-table-head-top">
                <th
                  className="subject-config-manager-table-head-top-search-cell"
                  colSpan="2"
                >
                  <div className="subject-config-manager-search">
                    <img
                      alt="icon"
                      className="subject-config-search-icon"
                      src={SearchIcon}
                    />

                    <input
                      className="subject-config-manager-input-field"
                      onChange={search.handleSearchChange}
                      onKeyDown={search.handleKeyDown}
                      placeholder={dict("manager/table/search-placeholder")}
                      type="text"
                    />
                  </div>
                </th>

                {selectedSubjectsCount > 0 && (
                  <th
                    className="subject-config-manager-table-head-top-remove-cell"
                    colSpan="2"
                  >
                    <button
                      className="subject-config-manager-table-buttons subject-config-manager-table-head-top-remove-cell-button"
                      onClick={() => setDisplaySelectedConfirmationModal(true)}
                    >
                      <span className="subject-config-manager-table-head-top-remove-cell-text">
                        {`${
                          dict("manager/table/remove-selected")[0]
                        } ${selectedSubjectsCount} ${
                          selectedSubjectsCount !== 1
                            ? dict("manager/table/remove-selected")[2]
                            : dict("manager/table/remove-selected")[1]
                        }`}
                      </span>
                    </button>
                  </th>
                )}
              </tr>

              <tr className="subject-config-manager-table-head-bottom">
                <th className="subject-config-manager-table-head-bottom-checkbox-cell">
                  <div className="subject-config-manager-table-head-bottom-checkbox-cell-container">
                    {selectAll ? (
                      <img
                        alt="green check"
                        className="checked-box-icon"
                        onClick={handleSelectAll}
                        src={CheckGreenIcon}
                      />
                    ) : (
                      <img
                        alt="unchecked"
                        className="unchecked-box-icon"
                        onClick={handleSelectAll}
                        src={UncheckedIcon}
                      />
                    )}
                  </div>
                </th>

                <th className="subject-config-manager-table-head-bottom-subject-cell">
                  <span className="subject-config-manager-table-head-bottom-cell-text">
                    {dict("manager/table/head/subject")}
                  </span>
                </th>

                <th className="subject-config-manager-table-head-bottom-teachers-cell">
                  <span className="subject-config-manager-table-head-bottom-cell-text">
                    {dict("manager/table/head/teachers")}
                  </span>
                </th>

                <th className="subject-config-manager-table-head-bottom-actions-cell">
                  <div className="subject-config-manager-table-head-bottom-actions-cell-text-container">
                    <span className="subject-config-manager-table-head-bottom-actions-cell-text">
                      {dict("manager/table/head/actions")}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>{displaySubjectManagerTableRow}</tbody>
          </table>
        </div>
      </div>

      <SubjectManagerConfirmationModal
        displayConfirmationModal={displaySelectedConfirmationModal}
        errorMessage={errorMessage}
        handleCancelButtonClick={() =>
          setDisplaySelectedConfirmationModal(false)
        }
        handleConfirmButtonClick={handleSelectedRemove}
        selected={selectedSubjectsCount}
      />
    </div>
  );
};

export default SubjectManager;
