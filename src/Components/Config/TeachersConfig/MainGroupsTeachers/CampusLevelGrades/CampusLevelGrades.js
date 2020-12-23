import React, { useState, useEffect, createRef } from 'react'

import '../../TeachersConfig.css';
import CampusLevelGradeGroups from '../CampusLevelGradeGroups/CampusLevelGradeGroups';
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import MinimizeIcon from "../../../../../SchoolAPP Assets/Minimize.svg";
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';
const baseUrl = process.env.REACT_APP_BASE_URL;

const CampusLevelGrades = (props) => {
  const accordionRef = createRef();

  const { grade, campusId, jwt, users, groups, setUpdated, mainTeachers, updated, gradeIdx, setWarning, setMainTeacherExistInGroup, queryStrings, isMainTeacherExistInGroup } = props;

  const [groupsList, setGroupsList] = useState(groups);
  const [isLoading, setIsLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const handleMinimizeButtonClick = () => {
    setMinimized(!minimized);
  };

  useEffect(() => {
    setGroupsList(groups);
    setIsLoading(false)
  }, [groups]);

  useEffect(() => {
    if (String(queryStrings.grade) === String(grade.id)) {
      setMinimized(true);
      accordionRef.current.classList.add('show');
    }
  }, [queryStrings]);

  return (
    <div id={`accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}`}>
      <div className="card">
        <div className="card-header" id={`accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}-heading-1-1-1-1`}>
          <h5 className="mb-0">
            {grade.name}
          </h5>
          <div className="pull-right">
            <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}-collapse-1-1-1-1`} aria-expanded="false" aria-controls={`accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}-collapse-1-1-1-1`}>
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
        <div id={`accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}-collapse-1-1-1-1`} ref={accordionRef} className="collapse" data-parent={`#accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}`} aria-labelledby={`accordion-${campusId}-main-teachers-level-${grade.levelId}-grade-${grade.id}-${gradeIdx}-heading-1-1-1-1`}>
          <div className="card-body">
            {isLoading ? <LoadingSpinner /> : (
              groupsList.filter(group => {
                return grade.id === group.gradeId
              }).map((group) => {
                return (
                  <CampusLevelGradeGroups
                    gradeIdx={gradeIdx}
                    queryStrings={queryStrings}
                    updated={updated}
                    campusId={campusId}
                    levelId={grade.levelId}
                    group={group}
                    jwt={jwt}
                    users={users}
                    mainTeachers={mainTeachers}
                    setUpdated={setUpdated}
                    setWarning={setWarning}
                    setMainTeacherExistInGroup={setMainTeacherExistInGroup}
                    isMainTeacherExistInGroup={isMainTeacherExistInGroup}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampusLevelGrades;
