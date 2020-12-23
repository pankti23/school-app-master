import React, { useState, useEffect } from 'react';
import axios from "axios";

import '../../TeachersConfig.css';
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';
import MinimizeIcon from '../../../../../SchoolAPP Assets/Minimize.svg';
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import AfterSchoolGroup from "../AfterSchoolGroup/AfterSchoolGroup";

const baseUrl = process.env.REACT_APP_BASE_URL;

const AfterSchoolGroups = (props) => {
    const { campus, jwt, users, afterSchoolGroups, setUpdated, afterSchoolGroupTeachers,
        combinedMainAndSubjectTeachers } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [afterSchoolGroupsList, setAfterSchoolGroupsList] = useState(afterSchoolGroups);
    // const [minimized, setMinimized] = useState(false);

    // const handleMinimizeButtonClick = () => {
    //     setMinimized(!minimized);
    // };

    useEffect(() => {
        setAfterSchoolGroupsList(afterSchoolGroups);
        setIsLoading(false)
    }, [afterSchoolGroups]);

    return (
       isLoading ? <LoadingSpinner /> : (
            afterSchoolGroupsList.filter(group => {
                return campus.id === group.campusId
            }).map((group) => {
                return (
                    <AfterSchoolGroup
                        campus={campus}
                        setUpdated={setUpdated}
                        afterSchoolGroups={afterSchoolGroups}
                        afterSchoolGroupTeachers={afterSchoolGroupTeachers}
                        combinedMainAndSubjectTeachers={combinedMainAndSubjectTeachers}
                        users={users}
                        group={group}
                        jwt={jwt}
                    />
                )
            })
        )             
    );
}

export default AfterSchoolGroups;

{/* <div id={`accordion-${campus.id}-after-groups-teachers-${campus.id}`}>
    <div className="card bg-light-grey">
        <div className="card-header" id={`accordion-${campus.id}-after-groups-teachers-${campus.id}-heading-1-3-1`}>
            <h5 className="mb-0">
                Extra-school teachers
        </h5>
            <div className="pull-right">
                <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${campus.id}-after-groups-teachers-${campus.id}-collapse-1-3-1`} aria-expanded="false" aria-controls={`accordion-${campus.id}-after-groups-teachers-${campus.id}-collapse-1-3-1`}>
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
        <div id={`accordion-${campus.id}-after-groups-teachers-${campus.id}-collapse-1-3-1`} className="collapse" data-parent={`#accordion-${campus.id}-after-groups-teachers-${campus.id}`} aria-labelledby={`accordion-${campus.id}-after-groups-teachers-${campus.id}-heading-1-3-1`}>
            <div className="card-body">
            </div>
        </div>
    </div>
</div> */}
