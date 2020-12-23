import React, { useRef, useState, useEffect } from "react";
import { updateStudent } from "../../../services/studentService";

import Button from "../../UI/Button";
import Select from "../../UI/Select";
import LoadingSpinner from "../../UI/LoadingSpinner";
import useOnClickOutside from "../../../CustomHooks/useOnClickOutside";

import { useDict } from "../../UI/Translations"

import './ModifyModal.css';

const ModifyModal = ({ rows, divisions, closeModal, onRefresh, usersList, setShowRoleAssignedAlert }) => {
  const ref = useRef();

  const [loading, setLoading] = useState(false);
  const [toUpdate, setToUpdate] = useState({});
  const [students, setStudents] = useState(JSON.parse(JSON.stringify(rows)));

  // Bulk update
  const [bulkUpdateCampus, setBulkUpdateCampus] = useState(null);
  const [bulkUpdateLevel, setBulkUpdateLevel] = useState(null);
  const [bulkUpdateGrade, setBulkUpdateGrade] = useState(null);
  const [bulkUpdateGroup, setBulkUpdateGroup] = useState(null);
  const [bulkUpdateAfterSchoolGroups, setBulkUpdateAfterSchoolGroups] = useState([]);
  const [errors, setErrors] = useState({
    studentName: '',
    campus: '',
    level: '',
    grade: '',
    group: '',
    parent1Email: ''
  }); 

  const dict = useDict("/students-page")

  const close = () => {
    setToUpdate({});
    setBulkUpdateCampus(null);
    setBulkUpdateLevel(null);
    setBulkUpdateGrade(null);
    setBulkUpdateGroup(null);
    closeModal();
  };

  const handleOnErrors = (fieldName, errMsg) => {
    setErrors((errs) => {
      //console.log(errs)
      return {
        ...errs,
        [fieldName]: errMsg
      }
    })
	}

  const validateEmptyField = (fieldName, fieldValue) => {
    if (!fieldValue) {
      return {
        message: `${fieldName} must be required`,
        status: false
      };
    }
    return {
      message: '',
      status: true
    };
  }

  const localUpdate = (id, key, value) => {
    const studentsCopy = [...students];
    const index = studentsCopy.findIndex((student) => student.id === id);
    let asgIndex;

    if (index === -1 || !value) return;

    if (key === 'AfterSchoolGroups') {
      if (studentsCopy[index].AfterSchoolGroups[asgIndex] !== null) {
        asgIndex = studentsCopy[index].AfterSchoolGroups.findIndex((asg) => asg.id === null);

        if (asgIndex !== -1) studentsCopy[index].AfterSchoolGroups[asgIndex] = value;
      } else {
        studentsCopy[index].AfterSchoolGroups = [{ value }];
      }
    } else if(key === 'name') {
      studentsCopy[index][key] = value;
    } else if(key === 'parent1Email') {
      if (studentsCopy[index] && studentsCopy[index]['Parents']) {
        studentsCopy[index]['Parents'][0]['email'] = value;
      } else {
        studentsCopy[index].Parents = [{ email: value, id: null, lastLogin: null, name: null, studentId: id }]
      }
    } else {
      studentsCopy[index][key] = {
        id: value.id,
        name: value.name
      };

      if (['Campus', 'Level', 'Grade'].indexOf(key) !== -1) {
        update(id, 'groupId', { id: null });
      }
    }

    setStudents(studentsCopy);
  };

  const update = (id, key, value, oldValue) => {
    const toUpdateCopy = { ...toUpdate };
    let removeIdex = null;

    if (!toUpdateCopy[id]) toUpdateCopy[id] = {};

    if (key === 'AfterSchoolGroups') {
      if (!Array.isArray(toUpdateCopy[id].newAsgIds)) toUpdateCopy[id].newAsgIds = [];

      if (value.removeId) {
        removeIdex = toUpdateCopy[id].newAsgIds.findIndex((id) => id === value.removeId);

        toUpdateCopy[id].newAsgIds.splice(removeIdex, 1);
      }

      toUpdateCopy[id].newAsgIds.push(value.id);
      toUpdateCopy[id].newAsgIds = [...new Set(toUpdateCopy[id].newAsgIds)].filter((asg) => asg !== null);
    } else {
      toUpdateCopy[id][key] = typeof value === 'string' ? value : value.id;

      if (key === 'parent1Email') toUpdateCopy[id]['parent1OldEmail'] = oldValue;
      if (key === 'parent2Email') toUpdateCopy[id]['parent2OldEmail'] = oldValue;
    }

    setToUpdate(toUpdateCopy);
  };

  const saveAndClose = (updates) => {
    const promises = [];

    setLoading(true);

    Object.keys(updates).map((id) => {
      promises.push(updateStudent({ id, ...updates[id] }));
    });

    Promise.all(promises).then(() => {
      setLoading(false);
      onRefresh();
      close();
      if(usersList && usersList.length > 0){
        let isExist = false;
        Object.keys(updates).map((id) => {
          isExist = usersList.some((user) => ((user.email === updates[id].parent1Email || user.email === updates[id].parent2Email) && user.Role.name !== 'Parent'))
        });
        setShowRoleAssignedAlert(isExist);
      }
    }).catch(err => {
      setLoading(false);
      handleOnErrors('parent1Email', err.message);
    });

    setToUpdate({});
  };

  const validateFormFields = () => {
    const nameIsValid = validateEmptyField('Student name', students[0].name);
    const campusIsValid = validateEmptyField('Campus', students[0].Campus);
    const levelIsValid = validateEmptyField('Level', students[0].Level);
    const gradeIsValid = validateEmptyField('Grade', students[0].Grade);
    const groupIsValid = validateEmptyField('Group', students[0].Group);
    //const email1IsValid = validateEmptyField('Email #1', toUpdate[students[0]?.id]?.parent1Email ?? (students[0]['Parents'] && students[0]['Parents'].length > 0 && students[0]['Parents'][0]['email']));
    const email1IsValid = {
      message: '',
      status: true
    };

    if (nameIsValid) {
      handleOnErrors('studentName', nameIsValid.message);
    }

    if (campusIsValid) {
      handleOnErrors('campus', campusIsValid.message);
    }

    if (levelIsValid) {
      handleOnErrors('level', levelIsValid.message);
    }

    if (gradeIsValid) {
      handleOnErrors('grade', gradeIsValid.message);
    }

    if (groupIsValid) {
      handleOnErrors('group', groupIsValid.message);
    }

    if (email1IsValid) {
      handleOnErrors('parent1Email', email1IsValid.message);
    }

    return nameIsValid.status && campusIsValid.status && levelIsValid.status && gradeIsValid.status && groupIsValid.status && email1IsValid.status;
  }

  const submitOne = () => {
    const isValidated = validateFormFields();
    if(isValidated){
      saveAndClose(toUpdate);
    }
  };

  const submitBulk = () => {
    const studentsCopy = [...students];
    let toUpdateBulk = {};

    for (let student of studentsCopy) {
      toUpdateBulk[student.id] = {
        campusId: bulkUpdateCampus || null,
        levelId: bulkUpdateLevel || null,
        gradeId: bulkUpdateGrade || null,
        groupId: bulkUpdateGroup || null,
        newAsgIds: bulkUpdateAfterSchoolGroups ? bulkUpdateAfterSchoolGroups.filter((asg) => asg !== null) : null,
        oldAsgIds: student.AfterSchoolGroups ? student.AfterSchoolGroups.map((asg) => asg.id) : null
      };
    }

    saveAndClose(toUpdateBulk);
  };

  const addNewAsg = (id) => {
    const studentsCopy = [...students];
    const index = studentsCopy.findIndex((student) => student.id === id);

    if (studentsCopy[index].AfterSchoolGroups === null) studentsCopy[index].AfterSchoolGroups = [];

    studentsCopy[index].AfterSchoolGroups.push({
      id: null,
      name: null,
      studentId: id
    });

    setStudents(studentsCopy);
  };

  const addNewAsgBulk = () => {
    const bulkUpdateAfterSchoolGroupsCopy = [...bulkUpdateAfterSchoolGroups];

    bulkUpdateAfterSchoolGroupsCopy.push(null);

    setBulkUpdateAfterSchoolGroups(bulkUpdateAfterSchoolGroupsCopy);
  };

  const updateBulkAfterSchoolGroups = (value) => {
    let bulkUpdateAfterSchoolGroupsCopy = [...bulkUpdateAfterSchoolGroups];
    let removeIdex;

    if (value.removeId) {
      removeIdex = bulkUpdateAfterSchoolGroupsCopy.findIndex((id) => id === value.removeId);

      bulkUpdateAfterSchoolGroupsCopy.splice(removeIdex, 1);
    }

    bulkUpdateAfterSchoolGroupsCopy.push(value.id);
    bulkUpdateAfterSchoolGroupsCopy = [...new Set(bulkUpdateAfterSchoolGroupsCopy)].filter((asg) => asg !== null);

    setBulkUpdateAfterSchoolGroups(bulkUpdateAfterSchoolGroupsCopy);
  };

  useEffect(() => {
    const toUpdateCopy = { ...toUpdate };

    for (let student of students) {
      if (!student.AfterSchoolGroups) continue;
      if (!toUpdateCopy[student.id]) toUpdateCopy[student.id] = {};

      toUpdateCopy[student.id].newAsgIds = student.AfterSchoolGroups.map((asg) => asg.id).filter((asg) => asg !== null);
      toUpdateCopy[student.id].oldAsgIds = student.AfterSchoolGroups.map((asg) => asg.id);
    }

    setToUpdate(toUpdateCopy);
  }, []);

  useOnClickOutside(ref, () => {
    if (!loading) close();
  });

  return (
    <div className="modify-student-modal-wrapper">
      <div ref={ref} className="modify-student-modal-container">
        <div className="modify-student-modal-header">
          <p>{`${dict("modify-modal/title")[0]} ${students.length} ${dict("modify-modal/title")[1]}`}</p>
        </div>

        <div className="modify-student-modal-content">
          {loading && <LoadingSpinner />}

          {!loading && <>
            {students.length === 1 && students.map((student) => {
              const campuses = divisions.campuses;
              const afterSchoolGroups = campuses ? (campuses.find((campus) => campus.id === (student.Campus || {}).id) || {}).afterSchoolGroups : [];
              const levels = campuses ? (campuses.find((campus) => campus.id === (student.Campus || {}).id) || {}).levels : [];
              const grades = levels ? (levels.find((level) => level.id === (student.Level || {}).id) || {}).grades : [];
              const groups = grades ? (grades.find((grade) => grade.id === (student.Grade || {}).id) || {}).groups : [];

              return <>
                <ul className="modify-student-modal-user">
                  <input type="hidden" value="something"/>
                  <li>
                    <label>{dict("modify-modal/input/student-name")}&nbsp;<span style={{color: 'red'}}>*</span>{errors.studentName && <span className="modify-student-modal-warning-message">&nbsp;&nbsp;{errors.studentName}</span>}</label>
                    <input type="text" defaultValue={student.name} onChange={(e) => {
                      update(student.id, 'name', e.target.value); 
                      localUpdate(student.id, 'name', e.target.value)
                    }} />
                  </li>
                  <li>
                    <label>{dict("modify-modal/input/campus")}&nbsp;<span style={{color: 'red'}}>*</span>{errors.campus && <span className="modify-student-modal-warning-message">&nbsp;&nbsp;{errors.campus}</span>}</label>
                    <Select onChange={(e) => {
                      update(student.id, 'campusId', JSON.parse(e.target.value));
                      localUpdate(student.id, 'Campus', JSON.parse(e.target.value))
                    }} size="default" disabled={!campuses || campuses.length === 0}>
                      <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                      {campuses && campuses.map((campus) => <option key={campus.id} value={JSON.stringify(campus)} selected={(student.Campus || {}).id === campus.id} width="100%">
                        {campus.name}
                      </option>)}
                    </Select>
                  </li>
                  <li>
                    <label>{dict("modify-modal/input/level")}&nbsp;<span style={{color: 'red'}}>*</span>{errors.level && <span className="modify-student-modal-warning-message">&nbsp;&nbsp;{errors.level}</span>}</label>
                    <Select onChange={(e) => localUpdate(student.id, 'Level', JSON.parse(e.target.value))} size="default" disabled={!levels || levels.length === 0}>
                      <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                      {levels && levels.map((level) => <option key={level.id} value={JSON.stringify(level)} selected={(student.Level || {}).id === level.id} width="100%">
                        {level.name}
                      </option>)}
                    </Select>
                  </li>
                  <li>
                    <label>{dict("modify-modal/input/grade")}&nbsp;<span style={{color: 'red'}}>*</span>{errors.grade && <span className="modify-student-modal-warning-message">&nbsp;&nbsp;{errors.grade}</span>}</label>
                    <Select onChange={(e) => localUpdate(student.id, 'Grade', JSON.parse(e.target.value))} size="default" disabled={!grades || grades.length === 0}>
                      <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                      {grades && grades.map((grade) => <option key={grade.id} value={JSON.stringify(grade)} selected={(student.Grade || {}).id === grade.id} width="100%">
                        {grade.name}
                      </option>)}
                    </Select>
                  </li>
                  <li>
                    <label>{dict("modify-modal/input/group")}&nbsp;<span style={{color: 'red'}}>*</span>{errors.group && <span className="modify-student-modal-warning-message">&nbsp;&nbsp;{errors.group}</span>}</label>
                    <Select onChange={(e) => {
                      update(student.id, 'groupId', JSON.parse(e.target.value));
                      localUpdate(student.id, 'Group', JSON.parse(e.target.value));
                    }} size="default" disabled={!groups || groups.length === 0}>
                      <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                      {groups && groups.map((group) => <option key={group.id} value={JSON.stringify(group)} selected={(student.Group || {}).id === group.id} width="100%">
                        {group.name}
                      </option>)}
                    </Select>
                  </li>
                  <li>
                    <label>{dict("modify-modal/input/asg")}</label>
                    {student.AfterSchoolGroups && student.AfterSchoolGroups.map((asg) => {
                      return <Select onChange={(e) => {
                        update(student.id, 'AfterSchoolGroups', JSON.parse(e.target.value));
                        localUpdate(student.id, 'AfterSchoolGroups', JSON.parse(e.target.value));
                      }} margin="0 0 10px 0" size="default" disabled={!afterSchoolGroups || afterSchoolGroups.length === 0}>
                        <option value={`{ "id": null, "removeId": ${asg.id} }`}>{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                        {afterSchoolGroups && afterSchoolGroups.map((a) => <option key={a.id} value={JSON.stringify({ ...a, removeId: asg.id })} selected={(asg || {}).id === a.id} width="100%">
                          {a.name}
                        </option>)}
                      </Select>;
                    })}

                    <Button size="small"
                      color="white"
                      margin="5px 0 0 0"
                      onClick={() => addNewAsg(student.id)}>{dict("modify-modal/button/add-new-asg")}</Button>
                  </li>
                  <li>
                  <label>{dict("modify-modal/input/email1")}&nbsp;<span style={{color: 'red'}}>*</span>{errors.parent1Email && <span className="modify-student-modal-warning-message">&nbsp;&nbsp;{errors.parent1Email}</span>}</label>
                    <input autoComplete="off" type="text" defaultValue={student.Parents && student.Parents[0] ? student.Parents[0].email : ''} onChange={(e) => {
                      update(student.id, 'parent1Email', e.target.value, (student.Parents && student.Parents[0]) ? student.Parents[0].email : ''); 
                      //localUpdate(student.id, 'parent1Email', e.target.value)
                    }} />
                  </li>
                  <li>
                    <label>{dict("modify-modal/input/email2")}</label>
                    <input autoComplete="off" type="text" defaultValue={(student.Parents && student.Parents[1]) ? student.Parents[1].email : ''} onChange={(e) => update(student.id, 'parent2Email', e.target.value, student.Parents && student.Parents[1] ? student.Parents[1].email : '')} />
                  </li>
                </ul>
              </>;
            })}

            {students.length > 1 && (() => {
              const campuses = divisions.campuses
              const afterSchoolGroups = campuses ? (campuses.find((campus) => campus.id === bulkUpdateCampus) || {}).afterSchoolGroups : [];
              const levels = campuses ? (campuses.find((campus) => campus.id === bulkUpdateCampus) || {}).levels : [];
              const grades = levels ? (levels.find((level) => level.id === bulkUpdateLevel) || {}).grades : [];
              const groups = grades ? (grades.find((grade) => grade.id === bulkUpdateGrade) || {}).groups : [];

              return <ul className="modify-student-modal-user">
                <li>
                  <label>Plantel</label>
                  <Select onChange={(e) => setBulkUpdateCampus(parseInt(e.target.value))} size="default" disabled={!campuses || campuses.length === 0}>
                    <option value="">-- Choose --</option>
                    {campuses && campuses.map((campus) => <option key={campus.id} value={campus.id} selected={bulkUpdateCampus === campus.id} width="100%">
                      {campus.name}
                    </option>)}
                  </Select>
                </li>
                <li>
                  <label>Nivel</label>
                  <Select onChange={(e) => setBulkUpdateLevel(parseInt(e.target.value))} size="default" disabled={!levels || levels.length === 0}>
                    <option value="">-- Choose --</option>
                    {levels && levels.map((level) => <option key={level.id} value={level.id} selected={bulkUpdateLevel === level.id} width="100%">
                      {level.name}
                    </option>)}
                  </Select>
                </li>
                <li>
                  <label>Grado</label>
                  <Select onChange={(e) => setBulkUpdateGrade(parseInt(e.target.value))} size="default" disabled={!grades || grades.length === 0}>
                    <option value="">-- Choose --</option>
                    {grades && grades.map((grade) => <option key={grade.id} value={grade.id} selected={bulkUpdateGrade === grade.id} width="100%">
                      {grade.name}
                    </option>)}
                  </Select>
                </li>
                <li>
                  <label>Grupo</label>
                  <Select onChange={(e) => setBulkUpdateGroup(parseInt(e.target.value))} size="default" disabled={!groups || groups.length === 0}>
                    <option value="">-- Choose --</option>
                    {groups && groups.map((group) => <option key={group.id} value={group.id} selected={bulkUpdateGroup === group.id} width="100%">
                      {group.name}
                    </option>)}
                  </Select>
                </li>
                <li>
                  <label>{dict("modify-modal/input/asg")}</label>
                  {bulkUpdateAfterSchoolGroups.map((asg) => {
                    return <Select onChange={(e) => updateBulkAfterSchoolGroups(JSON.parse(e.target.value))} margin="0 0 10px 0" size="default" disabled={!afterSchoolGroups || afterSchoolGroups.length === 0}>
                      <option value={`{ "id": null, "removeId": ${asg} }`}>{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                      {afterSchoolGroups && afterSchoolGroups.map((a) => <option key={a.id} value={JSON.stringify({ ...a, removeId: asg })} selected={asg === a.id} width="100%">
                        {a.name}
                      </option>)}
                    </Select>;
                  })}

                  <Button size="small"
                    color="white"
                    margin="5px 0 0 0"
                    onClick={() => addNewAsgBulk()}>{dict("modify-modal/button/add-new-asg")}</Button>
                </li>
              </ul>
            })()}
          </>}
        </div>

        <div className="modify-student-modal-bottom">
          <Button size="default"
            color="white"
            margin="0 15px 0 0"
            disabled={loading}
            onClick={close}>{dict("modify-modal/button/cancel")}</Button>
          <Button size="default"
            disabled={loading}
            onClick={students.length > 1 ? submitBulk : submitOne}
            color="green">{dict("modify-modal/button/save")}</Button>
        </div>
      </div>
    </div>
  );
};

export default ModifyModal;
