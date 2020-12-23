import React, { useState } from 'react';
import '../TeachersConfig.css';
import MinimizeIcon from '../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../SchoolAPP Assets/BlackPlus';
import AfterSchoolGroups from './AfterSchoolGroups/AfterSchoolGroups';

const AfterSchoolGroupsTeachers = (props) => {
    const { campus, jwt, users, afterSchoolGroups, setUpdated, afterSchoolGroupTeachers,
        combinedMainAndSubjectTeachers } = props;
    const [minimized, setMinimized] = useState(false);

    const handleMinimizeButtonClick = () => {
        setMinimized(!minimized);
    };
    return (
        <div id={`accordion-${campus.id}-after-groups-teachers`}>
            <div className="card">
                <div className="card-header" id={`accordion-${campus.id}-after-groups-teachers-heading-1-3`}>
                    <h5 className="mb-0">
                        All After-School Teachers
              </h5>
                    <div className="pull-right">
                        <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${campus.id}-after-groups-teachers-collapse-1-3`} aria-expanded="false" aria-controls={`accordion-${campus.id}-after-groups-teachers-collapse-1-3`}>
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
                <div id={`accordion-${campus.id}-after-groups-teachers-collapse-1-3`} className="collapse" data-parent={`#accordion-${campus.id}-after-groups-teachers`} aria-labelledby={`accordion-${campus.id}-after-groups-teachers-heading-1-3`}>
                    <div className="card-body">
                        <AfterSchoolGroups
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
    );
}

export default AfterSchoolGroupsTeachers;
