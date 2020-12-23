import React, { useState, useEffect, createRef } from "react";

import "../../TeachersConfig.css";

import MainGroupTeachersTableList from "../MainGroupTeachersTableList/MainGroupTeachersTableList";
import plusimg from "../../../../../SchoolAPP Assets/plus-black.svg";
import MinimizeIcon from "../../../../../SchoolAPP Assets/Minimize.svg";
import PlusIcon from "../../../../../SchoolAPP Assets/BlackPlus";
import AddCampusLevelGradeGroupTeachers from "../AddCampusLevelGradeGroupTeachers/AddCampusLevelGradeGroupTeachers";
import LoadingSpinner from "../../../../UI/LoadingSpinner";

import { useDict } from "../../../../UI/Translations";

const CampusLevelGroups = (props) => {
  const accordionRef = createRef();

  const [newly, setNewly] = useState({});

  const dict = useDict("/configuration-page/teachers");

  const {
    campusId,
    levelId,
    group,
    jwt,
    users,
    setUpdated,
    mainTeachers,
    updated,
    gradeIdx,
    setWarning,
    setMainTeacherExistInGroup,
    queryStrings,
    isMainTeacherExistInGroup
  } = props;
  const [aCLGGTModal, setACLGGTModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);

  const closeModal = () => {
    setACLGGTModal(false);
  };

  const handleMinimizeButtonClick = () => {
    setMinimized(!minimized);
  };

  useEffect(() => {
    if (String(queryStrings.group) === String(group.id)) {
      setMinimized(true);
      accordionRef.current.classList.add("show");
    }
  }, [queryStrings]);

  useEffect(() => {
    if (!updated) {
      setIsLoading(false);
    }
  }, [aCLGGTModal]);

  return (
    <React.Fragment>
      <div
        id={`accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}`}
      >
        <div className="card bg-light-grey">
          <div
            className="card-header"
            id={`accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}-heading-1-1-1-1-1`}
          >
            <h5 className="mb-0">{group.name}</h5>
            <div className="btn-popup">
              <button
                type="button"
                className="btn-addstaff"
                onClick={() => {
                  setACLGGTModal(true);
                }}
              >
                <img src={plusimg} />
                {dict("main-teachers/group/add-staff-button")}
              </button>
            </div>
            <div className="pull-right">
              <a
                className="collapsed btn-collapse btn-open"
                onClick={handleMinimizeButtonClick}
                role="button"
                data-toggle="collapse"
                href={`#accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}-collapse-1-1-1-1-1`}
                aria-expanded="false"
                aria-controls={`accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}-collapse-1-1-1-1-1`}
              >
                {minimized ? (
                  <img
                    alt="minimize-icon"
                    src={MinimizeIcon}
                    style={{ minWidth: "12px" }}
                  />
                ) : (
                  <PlusIcon
                    fill="#000000"
                    width="13px"
                    height="13px"
                    stroke="none"
                    style={{ minWidth: "13px" }}
                  />
                )}
                {minimized ? "Minimize" : "Open"}
              </a>
            </div>
          </div>
          <div
            id={`accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}-collapse-1-1-1-1-1`}
            ref={accordionRef}
            className="collapse"
            data-parent={`#accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}`}
            aria-labelledby={`accordion-${campusId}-main-teachers-level-${levelId}-grade-${group.gradeId}-group-${group.id}-heading-1-1-1-1-1`}
          >
            <div className="card-body">
              <MainGroupTeachersTableList
                setIsLoading={setIsLoading}
                setUpdated={setUpdated}
                ids={`${campusId}-${levelId}-${group.gradeId}-${group.id}`}
                gradeId={group.gradeId}
                groupId={group.id}
                groupName={group.name}
                teachers={group.MainTeacher ? [group.MainTeacher] : []}
                jwt={jwt}
                users={users}
              />
            </div>
          </div>
        </div>
      </div>
      <AddCampusLevelGradeGroupTeachers
        ids={`${campusId}-${levelId}-${group.gradeId}-${group.id}`}
        campusId={campusId}
        levelId={levelId}
        gradeId={group.gradeId}
        groupId={group.id}
        groupName={group.name}
        setUpdated={setUpdated}
        jwt={jwt}
        teachers={group.MainTeacher ? [group.MainTeacher] : []}
        users={users}
        mainTeachers={mainTeachers}
        setWarning={setWarning}
        isOpenModalForMainTeachers={aCLGGTModal}
        newAdded={(data) => setNewly(data)}
        closeModal={closeModal}
        isMainTeacherExistInGroup={isMainTeacherExistInGroup}
        setMainTeacherExistInGroup={setMainTeacherExistInGroup}
      />
    </React.Fragment>
  );
};

export default CampusLevelGroups;
