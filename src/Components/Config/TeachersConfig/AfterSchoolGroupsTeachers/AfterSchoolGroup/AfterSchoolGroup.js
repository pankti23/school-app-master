import React, { useState, useEffect } from 'react';

import '../../TeachersConfig.css';
import plusimg from '../../../../../SchoolAPP Assets/plus-black.svg';
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';
import MinimizeIcon from '../../../../../SchoolAPP Assets/Minimize.svg';
import AfterSchoolGroupTeachersList from '../AfterSchoolGroupTeachersList/AfterSchoolGroupTeachersList';

import AddAfterSchoolGroupTeachersModal from '../AddAfterSchoolGroupTeachers/AddAfterSchoolGroupTeachers';

const AfterSchoolGroup = (props) => {
    const { jwt, group, users, afterSchoolGroupTeachers,
        setUpdated,
        afterSchoolGroups,
        combinedMainAndSubjectTeachers,
        campus,
    } = props;

    const [aSGTModal, setASGTModal] = useState(false);
    const [asTeachers, setTeachersList] = useState([...combinedMainAndSubjectTeachers]);
    const [isLoading, setIsLoading] = useState(true);
    const [minimized, setMinimized] = useState(false);

    const handleMinimizeButtonClick = () => {
        setMinimized(!minimized);
    };
    const [afterSchoolGroupTeachersList, setAfterSchoolGroupTeachersList] = useState(afterSchoolGroupTeachers);

    useEffect(() => {
        setAfterSchoolGroupTeachersList(afterSchoolGroupTeachers);
        setIsLoading(false)
    }, [afterSchoolGroupTeachers]);

    useEffect(() => {
        setTeachersList([...combinedMainAndSubjectTeachers]);
        setIsLoading(false)
    }, [...combinedMainAndSubjectTeachers]);

    const teachers = afterSchoolGroupTeachersList.filter(afterSchoolGroupTeacher => {
        return group.id == afterSchoolGroupTeacher.groupId
    }).map(afterSchoolGroupTeacher => {
        return {
            id: afterSchoolGroupTeacher.Teacher.id,
            name: afterSchoolGroupTeacher.Teacher.name,
        }
    });

    const closeModal = () => {
        setASGTModal(false);
    };

    useEffect(() => {
        // setUpdated(true);
    }, [aSGTModal]);

    return (
        <div id={`accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}`}>
            <div className="card">
                <div className="card-header" id={`accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}-heading-1-3-1-1`}>
                    <h5 className="mb-0">
                        {group.name}
                    </h5>
                    <div className="btn-popup">
                        <button type="button" className="btn-addstaff" onClick={() => setASGTModal(true)}>
                            <img src={plusimg} />
                            Add Staff
                </button>
                    </div>
                    <div className="pull-right">
                        <a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}-collapse-1-3-1-1`} aria-expanded="false" aria-controls={`accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}-collapse-1-3-1-1`}>
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
                <div id={`accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}-collapse-1-3-1-1`} className="collapse" data-parent={`#accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}`} aria-labelledby={`accordion-${group.campusId}-after-groups-teachers-${group.campusId}-${group.id}-heading-1-3-1-1`}>
                    <div className="card-body">
                        <AfterSchoolGroupTeachersList
                            campus={campus}
                            afterSchoolGroups={afterSchoolGroups}
                            setUpdated={setUpdated}
                            groupId={group.id}
                            ids={`${group.campusId}-${group.id}`}
                            users={users}
                            teachers={teachers}
                            jwt={jwt} />
                    </div>
                </div>
            </div>
            <AddAfterSchoolGroupTeachersModal
                setUpdated={setUpdated}
                groupId={group.id}
                campusId={campus.id}
                groupName={group.name}
                jwt={jwt}
                asTeachers={asTeachers}
                isModalOpenForAfterSchoolTeachers={aSGTModal}
                closeModal={closeModal} />
        </div>
    );
}

export default AfterSchoolGroup;
