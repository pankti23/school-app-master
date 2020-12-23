import React, { useState, createRef, useEffect } from 'react';
import '../TeachersConfig.css';
import plusimg from '../../../../SchoolAPP Assets/plus-black.svg';
import MinimizeIcon from "../../../../SchoolAPP Assets/Minimize.svg";
import PlusIcon from "../../../../SchoolAPP Assets/BlackPlus";
import SubjectGroups from './SubjectGroups/SubjectGroups';

const SubjectGroupsTeachers = (props) => {
  const accordionRef = createRef();

  const { campus, jwt, subjects, subjectTeachers, levels, grades, groups, setUpdated, users, groupSubjectTeachers, divisionsTree, queryStrings, setWarningForSTNotInCampus } = props;
  const [minimized, setMinimized] = useState(false);
  const handleMinimizeButtonClick = () => {
    setMinimized(!minimized);
  };

	useEffect(() => {
		if (String(queryStrings.campus) === String(campus.id) && String(queryStrings.type) === 'subject') {
      setMinimized(true);
      accordionRef.current.classList.add('show');
    }
  }, [queryStrings]);

  return (
    <div id={`accordion-${campus.id}-subject-teachers`}>
      <div className="card">
        <div className="card-header" id={`accordion-${campus.id}-subject-teachers-heading-1-2`}>
          <h5 className="mb-0">
            All Subject Teachers
                </h5>
          <div className="pull-right">
            <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${campus.id}-subject-teachers-collapse-1-2`} aria-expanded="false" aria-controls={`accordion-${campus.id}-subject-teachers-collapse-1-2`}>
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
        <div id={`accordion-${campus.id}-subject-teachers-collapse-1-2`} ref={accordionRef} className="collapse" data-parent={`#accordion-${campus.id}-subject-teachers`} aria-labelledby={`accordion-${campus.id}-subject-teachers-heading-1-2`}>
          <div className="card-body">
            <SubjectGroups
              campus={campus}
              jwt={jwt}
              subjects={subjects}
              subjectTeachers={subjectTeachers}
              levels={levels}
              grades={grades}
              groups={groups}
              users={users}
              setUpdated={setUpdated}
              groupSubjectTeachers={groupSubjectTeachers}
              divisionsTree={divisionsTree}
              setWarningForSTNotInCampus={setWarningForSTNotInCampus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectGroupsTeachers;
