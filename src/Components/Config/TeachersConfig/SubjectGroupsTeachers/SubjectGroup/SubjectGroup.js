import React, { useEffect, useState } from 'react';
import axios from "axios";

import '../../TeachersConfig.css';
import plusimg from '../../../../../SchoolAPP Assets/plus-black.svg';
import MinimizeIcon from "../../../../../SchoolAPP Assets/Minimize.svg";
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';
import SubjectGroupTeachersList from '../SubjectGroupTeachersList/SubjectGroupTeachersList';
import AddGroupTeachersModal from '../AddGroupTeachers/AddGroupTeachers';
import LoadingSpinner from '../../../../UI/LoadingSpinner';

const baseUrl = process.env.REACT_APP_BASE_URL;

const SubjectGroup = (props) => {
    const { subject, campus, jwt, grades, groups, setWarningForSTNotInCampus, users, subjectTeachers, setUpdated, divisionsTree, groupSubjectTeachers } = props;

    const [subjectTeachersList, setSubjectTeachersList] = useState(subjectTeachers);
    const [aGTModal, setGTModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const handleMinimizeButtonClick = () => {
        setMinimized(!minimized);
    };
   
    useEffect(() => {
        setSubjectTeachersList(subjectTeachers); //.filter((teacher) => teacher.campusId === campus.id)
        setIsLoading(false);
    }, [subjectTeachers])

    const closeModal = () => {
        setGTModal(false);
    };

    const teachers = subjectTeachers.filter((subjectTeacher) => {
        if(subjectTeacher.Subjects && subjectTeacher.Subjects.length > 0 && subjectTeacher.Subjects.filter((opt)=>{
           if(opt.id == subject.id){
             return opt
           }
        }).length>0){
          return subjectTeacher;
        }
    });

    let levels = divisionsTree.campuses.filter((tree) => tree.id === campus.id).map((res) => res.levels);

    return (
        <div id={`accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}`}>
            <div className="card">
                <div className="card-header" id={`accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}-heading-1-2-1-1`}>
                    <h5 className="mb-0">
                        {subject.name}
                    </h5>
                    <div className="btn-popup">
                        <button type="button" className="btn-addstaff" onClick={() => { setGTModal(true) }}>
                            <img src={plusimg} />
                  Add Staff
                </button>
                    </div>
                    <div className="pull-right">
                        <a className="collapsed btn-collapse btn-open" role="button" onClick={handleMinimizeButtonClick} data-toggle="collapse" href={`#accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}-collapse-1-2-1-1`} aria-expanded="false" aria-controls={`accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}-collapse-1-2-1-1`}>
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
                <div id={`accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}-collapse-1-2-1-1`} className="collapse" data-parent={`#accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}`} aria-labelledby={`accordion-${campus.id}-subject-teachers-${campus.id}-${subject.id}-heading-1-2-1-1`}>
                    <div className="card-body">
                        <SubjectGroupTeachersList
                            setUpdated={setUpdated}
                            levels={levels[0]}
                            ids={`${campus.id}-${subject.id}`}
                            campus={campus}
                            subject={subject}
                            users={users}
                            grades={grades}
                            groupSubjectTeachers={groupSubjectTeachers}
                            groups={groups}
                            teachers={teachers}
                            jwt={jwt} 
                        />
                    </div>
                </div>
            </div>
            <AddGroupTeachersModal
                setUpdated={setUpdated}
                subjectId={subject.id}
                subjectName={subject.name}
                jwt={jwt}
                campusId={campus.id}
                users={users}
                subjectTeachers={subjectTeachersList}
                isModalOpenForSubjectTeachers={aGTModal}
                setWarningForSTNotInCampus={setWarningForSTNotInCampus}
                closeModal={closeModal} />
        </div>
    );
}

export default SubjectGroup;
