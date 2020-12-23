import React, { useState, useEffect, createRef } from 'react'

import '../../TeachersConfig.css';
import CampusLevelGrades from '../CampusLevelGrades/CampusLevelGrades';
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import MinimizeIcon from "../../../../../SchoolAPP Assets/Minimize.svg";
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';

const CampusLevels = (props) => {
  const accordionRef = createRef();

  const { level, users, grades, groups, setUpdated, mainTeachers, updated, setWarning, setMainTeacherExistInGroup, queryStrings, isMainTeacherExistInGroup } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [gradesList, setGradesList] = useState(grades);
  const [minimized, setMinimized] = useState(false);
  const handleMinimizeButtonClick = () => {
    setMinimized(!minimized);
  };

  useEffect(() => {
    setGradesList(grades);
    setIsLoading(false);
  }, [grades]);

  useEffect(() => {
		if (String(queryStrings.level) === String(level.id)) {
      setMinimized(true);
      accordionRef.current.classList.add('show');
    }
  }, [queryStrings]);

  return (
    <div id={`accordion-${level.campusId}-main-teachers-level-${level.id}`}>
      <div className="card bg-light-grey">
        <div className="card-header" id={`accordion-${level.campusId}-main-teachers-level-${level.id}-heading-1-1-1`}>
          <h5 className="mb-0">
            {level.name}
          </h5>
          <div className="pull-right">
            <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${level.campusId}-main-teachers-level-${level.id}-collapse-1-1-1`} aria-expanded="false" aria-controls={`accordion-${level.campusId}-main-teachers-level-${level.id}-collapse-1-1-1`}>
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
        <div id={`accordion-${level.campusId}-main-teachers-level-${level.id}-collapse-1-1-1`} ref={accordionRef} className="collapse" data-parent={`#accordion-${level.campusId}-main-teachers-level-${level.id}`} aria-labelledby={`accordion-${level.campusId}-main-teachers-level-${level.id}-heading-1-1-1`}>
          <div className="card-body">
            {isLoading ? <LoadingSpinner /> : (
              gradesList.filter(grade => {
                return level.id === grade.levelId
              }).map((grade, gradeIdx) => {
                return (
                  <CampusLevelGrades
                    updated={updated}
                    queryStrings={queryStrings}
                    mainTeachers={mainTeachers}
                    campusId={level.campusId}
                    gradeIdx={gradeIdx}
                    grade={grade}
                    jwt={props.jwt}
                    users={users}
                    groups={groups}
                    setUpdated={setUpdated}
                    setWarning={setWarning}
                    setMainTeacherExistInGroup={setMainTeacherExistInGroup}
                    isMainTeacherExistInGroup={isMainTeacherExistInGroup}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampusLevels;
