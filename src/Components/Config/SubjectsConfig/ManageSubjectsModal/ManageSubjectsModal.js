import React, { useState, useEffect } from "react";

import Button from "../../../UI/Button";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import PlusIcon from "../../../../SchoolAPP Assets/plus.svg";
import SearchIcon from "../../../../SchoolAPP Assets/search.svg";
import SubjectModalRow from "./SubjectModalRow/SubjectModalRow";
import useOnClickOutside from "../../../../CustomHooks/useOnClickOutside";
import { Search } from "../../../UI/Search/Search";
import { createSubject } from "../../../../services/subjectService";
import { defaultSubjectsData } from "./defaultSubjectsData";
import { useDict } from "../../../UI/Translations";

import "./ManageSubjectsModal.css";

const ManageSubjectsModal = (props) => {
  const { subjects, toggleManageSubjectsModal, loadData } = props;

  const [allSubjects, setAllSubjects] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [newSubject, setNewSubject] = useState("");

  const dict = useDict("/configuration-page/subjects");

  const ref = React.useRef(null);

  const searchObj = Search(allSubjects);

  const handleSaveClick = () => {
    const getSelectedSubjects = allSubjects.filter((subject) => {
      return subject.checked;
    });

    getSelectedSubjects.forEach(async (subject) => {
      await createSubject({
        name: subject.name
      });
      await loadData();
    });

    setLoading(false);
    toggleManageSubjectsModal(false);
  };

  const toggleRowCheck = (name, state) => {
    const nameIndex = allSubjects.map((subject) => subject.name).indexOf(name);
    let allSubjectsCopy = allSubjects.slice();
    allSubjectsCopy.splice(nameIndex, 1, {
      ...allSubjectsCopy[nameIndex],
      checked: state
    });
    setAllSubjects(allSubjectsCopy);
  };

  const deleteSubject = (name) => {
    const nameIndex = allSubjects.map((subject) => subject.name).indexOf(name);
    let allSubjectsCopy = allSubjects.slice();
    allSubjectsCopy.splice(nameIndex, 1);
    setAllSubjects(allSubjectsCopy);
  };

  const handleNewSubjectInputChange = (event) => {
    setErrorMessage("");

    setNewSubject(event.target.value);
  };

  const handleCreateCustomSubject = () => {
    const allSubjectsLowerCase = allSubjects.map((subject) => {
      return subject.name.toLowerCase().trim();
    }); // this returns an array of the string names of the subject

    const isPresentIndex = allSubjectsLowerCase.indexOf(
      newSubject.toLowerCase().trim()
    );

    const allSubjectsLowerCase2 = Object.values(subjects).map((subject) => {
      return subject.name.toLowerCase().trim();
    }); // this returns an array of the string names of the subject

    const isPresentIndex2 = allSubjectsLowerCase2.indexOf(
      newSubject.toLowerCase().trim()
    );

    if (isPresentIndex > -1 || isPresentIndex2 > -1) {
      // if the subject name is already present
      // alert("This subject is already present, please enter a new subject.");
      setErrorMessage(dict("manage-subjects-modal/message/error/exists"));

      setNewSubject("");
    } else if (newSubject && newSubject.trim() !== "") {
      setAllSubjects([
        { name: newSubject.trim(), checked: false },
        ...allSubjects
      ]);
      setNewSubject("");
      searchObj.setSearchPattern("");
    }
  };

  const handleCreatingSubjectKeyDown = (event) => {
    if (event.keyCode === 13) {
      // keycode 13 is enter
      handleCreateCustomSubject();
    }
  };

  useOnClickOutside(ref, () => toggleManageSubjectsModal(false));

  useEffect(() => {
    searchObj.setDisplayedContents(allSubjects);
  }, [allSubjects]);

  useEffect(() => {
    searchObj.search();
  }, [searchObj]);

  useEffect(() => {
    const allSubjects = [];
    const presentSubjectsLowerCase = subjects.map((subject) => {
      return subject.name.toLowerCase();
    });

    defaultSubjectsData.forEach((subject, index) => {
      const isPresentIndex = presentSubjectsLowerCase.indexOf(
        subject.name.toLowerCase()
      );

      if (isPresentIndex < 0) {
        // if it is not present for the school
        allSubjects.push(subject);
      }
    });
    setAllSubjects(allSubjects);
  }, [subjects]);

  const displaySubjectModelRow = searchObj.displayedContents.map(
    (subject, index) => {
      return (
        <SubjectModalRow
          name={subject.name}
          checked={subject.checked}
          isDefault={subject.isDefault}
          key={index}
          toggleRowCheck={toggleRowCheck}
          deleteSubject={deleteSubject}
        />
      );
    }
  );

  return (
    <div ref={ref}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="manage-subjects-modal-container">
          <div className="manage-subjects-modal-header">
            <p className="manage-subjects-modal-header-text">
              {dict("manage-subjects-modal/header-title")}
            </p>
          </div>

          <div className="create-custom-subject-container">
            <p className="add-custom-subject-text">
              {dict("manage-subjects-modal/custom-subject/title")}
            </p>
            <div className="manage-custom-subject-modal-row">
              <div className="manage-subject-modal-search">
                <input
                  className="manage-subject-modal-search-field"
                  type="text"
                  value={newSubject}
                  onChange={handleNewSubjectInputChange}
                  onKeyDown={handleCreatingSubjectKeyDown}
                  placeholder={dict(
                    "manage-subjects-modal/custom-subject/subject-name-placeholder"
                  )}
                />
              </div>

              <Button
                color="grey"
                onClick={handleCreateCustomSubject}
                size="medium"
                style={{ padding: "0 8px" }}
              >
                <img
                  alt="plus-icon"
                  src={PlusIcon}
                  style={{ marginRight: "6px" }}
                />
                <p className="add-custom-subject-button-text">
                  {dict("manage-subjects-modal/custom-subject/add-button")}
                </p>
              </Button>
            </div>

            {errorMessage && (
              <div className="custom-subject-error-container">
                <span className="custom-subject-error-message">
                  {errorMessage}
                </span>
              </div>
            )}
          </div>

          <div className="search-subject-library-container">
            <div className="subject-library-search-bar">
              <img
                alt="icon"
                className="subject-config-search-icon"
                src={SearchIcon}
              />
              <input
                className="subject-library-input-field"
                type="text"
                value={searchObj.searchPattern}
                placeholder={dict("manage-subjects-modal/search-placeholder")}
                onChange={searchObj.handleSearchChange}
                onKeyDown={searchObj.handleKeyDown}
              />
            </div>
            <div className="subject-modal-row-container">
              {displaySubjectModelRow}
            </div>
          </div>

          <div className="manage-subject-modal-save-container">
            <Button
              color="white"
              onClick={() => toggleManageSubjectsModal(false)}
              size="medium"
              style={{ marginRight: "8px" }}
              width="70px"
            >
              <span className="manage-subject-modal-cancel-button-text">
                {dict("manage-subjects-modal/button/cancel")}
              </span>
            </Button>

            <Button
              color="green"
              onClick={handleSaveClick}
              size="medium"
              width="70px"
            >
              <span className="manage-subject-modal-save-button-text">
                {dict("manage-subjects-modal/button/confirm")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubjectsModal;
