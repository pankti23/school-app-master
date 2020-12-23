import React, {useEffect, useState} from "react";

import '../../../TeachersConfig.css';

import { removeAfterSchoolGroupTeacher } from "../../../../../../services/afterSchoolGroupTeachersService";

import ExtraCurricularActivitiesList from './ExtraCurricularActivitiesList/ExtraCurricularActivitiesList'

const TeacherTableRow = (props) => {
  const {
    uniqeID,
    setUpdated,
    checked,
    index,
    selectAll,
    setChecked,
    setSelectAll,
    setUncheckAll,
    afterSchoolTeacherDetail,
    selectedTeachersCount,
    afterSchoolGroups,
    uncheckAll,
    userId,
    groupId,
    campusId,
    jwt,
    // teacherHasSelectedAfterSchoolGroups,
  } = props;

  const teachers = selectedTeachersCount[userId] ?? 0;

  // const [isExtraCurricular, setExtraCurricular] = useState(false);
  
  // const [afterSchoolGroupsList, setAfterSchoolGroupsList] = useState(afterSchoolGroups);
  // const [checkedArray, setCheckedArray] = useState([]);

  const [afterSchoolTeacher, setAfterSchoolTeacher] = useState(afterSchoolTeacherDetail);

  // const [teacherHasSelectedAfterSchoolGroupsList, setTeacherHasSelectedAfterSchoolGroupsList] = useState(teacherHasSelectedAfterSchoolGroups);

  useEffect(() => {
    // setAfterSchoolGroupsList(afterSchoolGroups)
  }, [afterSchoolGroups]);

  useEffect(() => {
    setAfterSchoolTeacher(afterSchoolTeacherDetail);
    // if(afterSchoolTeacher && afterSchoolTeacher.AfterSchoolGroups && afterSchoolTeacher.AfterSchoolGroups.length > 0){
    //   setCheckedArray(teacherHasSelectedAfterSchoolGroups.map(group => true))
    // } 
  },[afterSchoolTeacherDetail]);

  // useEffect(() => {
  //   setTeacherHasSelectedAfterSchoolGroupsList(teacherHasSelectedAfterSchoolGroups);
  // }, [teacherHasSelectedAfterSchoolGroups]);

  // const handleCheck = (index, bool) => {
  //   const arr = checkedArray.map(v => v);
  //   arr[index] = bool;
  //   setCheckedArray(arr);
  // };

  const handleChecked = () => {
    if (teachers === 0) {
      if (checked) {
        setChecked(index, false);
      } else {
        setChecked(index, true);
      }
  
      if (selectAll) {
        setSelectAll(false);
      }
    }
  };

  useEffect(() => {
    if (uncheckAll) {
      setChecked(index, false);
      setUncheckAll(false);
    }
  }, [uncheckAll, setUncheckAll]);

  const handleRemove = async id => {
    const data = {
      "group_id": groupId,
      "user_id": userId
    }
    const deleteAfterSchoolGroupTeacher = async () => {
      const deleteResponse = await removeAfterSchoolGroupTeacher(data);

      if (deleteResponse.status === 200) {
        setSelectAll(false);
      }
    };

    try {
      deleteAfterSchoolGroupTeacher();
      setUpdated(true)
    } catch (e) {
      alert(e);
    }
  };

  return (
    <tr key={uniqeID}>
			<td>
				<div className="form-group check-box">
          <input type="checkbox" id={`after-school-teacher-td-${afterSchoolTeacher && 'id' in afterSchoolTeacher && afterSchoolTeacher.id}-${index}`} checked={checked} onChange={handleChecked} />
          <label for={`after-school-teacher-td-${afterSchoolTeacher && 'id' in afterSchoolTeacher && afterSchoolTeacher.id}-${index}`}>HTML</label>
				</div>
			</td>
			<td>{`${afterSchoolTeacher && 'name' in afterSchoolTeacher && afterSchoolTeacher.name} (${afterSchoolTeacher && 'email' in afterSchoolTeacher && afterSchoolTeacher.email})`}</td>
			{/* <td>
        <div className="select-dropdown" id={`after-school-teacher-td-dropdown-${groupId}-${userId}-${index}`}>
          <ul>
            <li>
              <div 
                name={`div-extra-curricular-${groupId}-${userId}-${index}`}
                id={`div-extra-curricular-${groupId}-${userId}-${index}`}
                onClick={(event) => {
                  if (isExtraCurricular){
                    setExtraCurricular(false);
                  } else{
                    setExtraCurricular(true);
                  }
                }} className="droplink">
                {teacherHasSelectedAfterSchoolGroupsList && teacherHasSelectedAfterSchoolGroupsList.join()}
              </div>
              <ul 
                name={`dropdown-ul-${groupId}-${userId}-${index}`} 
                id={`dropdown-ul-${groupId}-${userId}-${index}`} 
                className={`dropdown-box ${isExtraCurricular ? 'show': ''}`}>
                <p>Extra-curricular Groups</p>
                {afterSchoolGroupsList.filter((group) => {
                    return campusId === group.campusId
                  }).map((group, keyIndex) => {
                    return (
                      <ExtraCurricularActivitiesList
                        jwt={jwt}
                        setUpdated={setUpdated}
                        groupId={groupId}
                        userId={userId}
                        checked={checkedArray[keyIndex]}
                        index={keyIndex}
                        setChecked={handleCheck}
                        afterSchoolGroup={group}
                      />
                    );
                  })}
              </ul>
            </li>
          </ul>
        </div>
      </td> */}
			<td>
        <button 
          type="button" 
          id={`after-school-teacher-remove-${uniqeID}`} 
          className="remove" 
          onClick={() => handleRemove(afterSchoolTeacher && 'id' in afterSchoolTeacher && afterSchoolTeacher.id)}>
          Remove
        </button>
      </td>
		</tr>
  );
};

export default TeacherTableRow;
