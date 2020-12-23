import React, { useState, useEffect } from 'react';

import '../../TeachersConfig.css';

import LoadingSpinner from "../../../../UI/LoadingSpinner";
import SubjectGroup from '../SubjectGroup/SubjectGroup';
// import MinimizeIcon from "../../../../../SchoolAPP Assets/Minimize.svg";
// import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';

const SubjectGroups = (props) => {
    const { campus, jwt, subjects, subjectTeachers, levels, grades, groups, setUpdated, users, groupSubjectTeachers, divisionsTree, setWarningForSTNotInCampus } = props;

    const [isLoading, setIsLoading] = useState(true);

    const [subjectsList, setSubjectsList] = useState(subjects);
    // const [minimized, setMinimized] = useState(false);

    // const handleMinimizeButtonClick = () => {
    //     setMinimized(!minimized);
    // };

    useEffect(() => {
      setSubjectsList(subjects);
      setIsLoading(false)
    }, [subjects]);


    return (
        isLoading ? <LoadingSpinner /> : (
            subjectsList.map((subject) => {
                return (
                    <SubjectGroup
                    campus={campus}
                    subject={subject}
                    jwt={jwt}
                    levels={levels}
                    grades={grades} 
                    groups={groups}
                    groupSubjectTeachers={groupSubjectTeachers}
                    subjectTeachers={subjectTeachers}
                    users={users}
                    setUpdated={setUpdated}
                    divisionsTree={divisionsTree}
                    setWarningForSTNotInCampus={setWarningForSTNotInCampus}
                    />
                );
            })
        )           
    );
}

export default SubjectGroups;


{/* <div id={`accordion-${campus.id}-subject-teachers-${campus.id}`}>
    <div className="card bg-light-grey">
        <div className="card-header" id={`accordion-${campus.id}-subject-teachers-${campus.id}-heading-1-2-1`}>
            <h5 className="mb-0">
                Subject teachers
                    </h5>
            <div className="pull-right">
                <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${campus.id}-subject-teachers-${campus.id}-collapse-1-2-1`} aria-expanded="false" aria-controls={`accordion-${campus.id}-subject-teachers-${campus.id}-collapse-1-2-1`}>
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
        <div id={`accordion-${campus.id}-subject-teachers-${campus.id}-collapse-1-2-1`} className="collapse" data-parent={`#accordion-${campus.id}-subject-teachers-${campus.id}`} aria-labelledby={`accordion-${campus.id}-subject-teachers-${campus.id}-heading-1-2-1`}>
            <div className="card-body">
            </div>
        </div>
    </div>
</div> */}
