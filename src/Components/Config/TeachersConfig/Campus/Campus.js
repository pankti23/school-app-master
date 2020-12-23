import React, { useState, useEffect, createRef } from 'react'
import '../TeachersConfig.css'
import MinimizeIcon from '../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../SchoolAPP Assets/BlackPlus';
import MainGroupsTeachers from '../MainGroupsTeachers/MainGroupsTeachers';
import SubjectGroupsTeachers from '../SubjectGroupsTeachers/SubjectGroupsTeachers';
import AfterSchoolGroupsTeachers from '../AfterSchoolGroupsTeachers/AfterSchoolGroupsTeachers';

const Campus = (props) => {
  const accordionRef = createRef();

  const {
    campus,
    jwt,
    subjects,
    users,
    levels,
    grades,
    groups,
    updated,
    setUpdated,
    afterSchoolGroups,
    afterSchoolGroupTeachers,
    mainTeachers,
    subjectTeachers,
    groupSubjectTeachers,
    divisionsTree,
    setWarning,
    setWarningForSTNotInCampus,
    setMainTeacherExistInGroup,
    combinedMainAndSubjectTeachers,
    queryStrings,
    isMainTeacherExistInGroup
  } = props;

  const [minimized, setMinimized] = useState(false);

  const handleMinimizeButtonClick = () => {
    setMinimized(!minimized);
  };

  useEffect(() => {
		if (String(queryStrings.campus) === String(campus.id)) {
      setMinimized(true);
      accordionRef.current.classList.add('show');
    }
  }, [queryStrings]);

  return (
    <div id={`accordion-${campus.id}`}>
      <div className="card">
        <div className="card-header" id={`heading-${campus.id}`}>
          <h5 className="mb-0">
            {campus.name}
          </h5>
          <div className="pull-right">
            <a className="btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#collapse-${campus.id}`} aria-expanded="true" aria-controls={`collapse-${campus.id}`}>
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
        {/* <div id={`collapse-${campus.id}`} className="collapse show" data-parent={`#accordion-${campus.id}`} aria-labelledby={`heading-${campus.id}`}> */}
        <div id={`collapse-${campus.id}`} ref={accordionRef} className="collapse" data-parent={`#accordion-${campus.id}`} aria-labelledby={`heading-${campus.id}`}>
          <div className="card-body">
            <MainGroupsTeachers
              queryStrings={queryStrings}
              campus={campus}
              jwt={jwt}
              users={users}
              levels={levels}
              grades={grades}
              groups={groups}
              mainTeachers={mainTeachers}
              updated={updated}
              setUpdated={setUpdated}
              setWarning={setWarning}
              setMainTeacherExistInGroup={setMainTeacherExistInGroup}
              isMainTeacherExistInGroup={isMainTeacherExistInGroup}
            />
            {/* <div className="grey-line" style={{ marginBottom: "20px" }}></div> */}
            <SubjectGroupsTeachers
              queryStrings={queryStrings}
              campus={campus}
              jwt={jwt}
              subjects={subjects}
              subjectTeachers={combinedMainAndSubjectTeachers}
              levels={levels}
              grades={grades}
              groups={groups}
              users={users}
              setUpdated={setUpdated}
              groupSubjectTeachers={groupSubjectTeachers}
              divisionsTree={divisionsTree}
              setWarningForSTNotInCampus={setWarningForSTNotInCampus}
            />
            {/* <div className="grey-line" style={{ marginBottom : "20px" }}></div> */}
            <AfterSchoolGroupsTeachers
              afterSchoolGroups={afterSchoolGroups}
              afterSchoolGroupTeachers={afterSchoolGroupTeachers}
              combinedMainAndSubjectTeachers={combinedMainAndSubjectTeachers}
              setUpdated={setUpdated}
              campus={campus}
              jwt={jwt}
              users={users} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Campus;
