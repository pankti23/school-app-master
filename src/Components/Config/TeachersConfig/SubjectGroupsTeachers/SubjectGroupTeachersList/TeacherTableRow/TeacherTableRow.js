import React, {useEffect, useState, useRef} from "react";
import axios from "axios";

import '../../../TeachersConfig.css';

import GradesList from './GradesList/GradesList';
import GroupsList from './GroupsList/GroupsList';

import useOutsideClick from '../../../../../../CustomHooks/useOutsideClick'

const baseUrl = process.env.REACT_APP_BASE_URL;

const TeacherTableRow = (props) => {
  const {
    ids,
    index,
    subjectId,
    checked,
    selectAll,
    setChecked,
    setSelectAll,
    setUncheckAll,
    uncheckAll,
    selectedGrades,
    selectedGroups,
    allUsers,
    groupSubjectTeacher,
    groups,
    grades,
    campusId,
    levels,
    subjectTeacher,
    subjectTeacherId,
    selectedTeachersCount,
    setUpdated,
    jwt,
  } = props;

  const subjectTeachers = selectedTeachersCount[subjectTeacherId] ?? 0;

  const [SThasSelectedGrades, setSTSelectedGrades] = useState([]);
  const [SThasSelectedGroups, setSTSelectedGroups] = useState([]);

  const [subjectTInfo, setSTinfo] = useState(subjectTeacher);

  const [isSelectedGradesDropdown, setSelectedGradesDropdown] = useState(false);
  const [isSelectedGroupsDropdown, setSelectedGroupsDropdown] = useState(false);

  const [checkedGradesArray, setCheckedGradesArray] = useState([]);
  const [checkedGroupsArray, setCheckedGroupsArray] = useState([]);

  const [levelsList, setLevelsList] = useState(levels);

  const refForGrades = useRef();
  const refForGroups = useRef();

  useOutsideClick(() => {
    setSelectedGradesDropdown(false);
  }, refForGrades);

  useOutsideClick(() => {
    setSelectedGroupsDropdown(false);
  }, refForGroups);

  useEffect(() => {
    setLevelsList(levelsList);
  }, [levels]);

  useEffect(() => {
    setSTinfo(subjectTeacher);

    if (groupSubjectTeacher?.length > 0) {
      let gradeids = [];

      let gradeNames = [];

      groupSubjectTeacher.map(gst => {
        if(gst.Group?.gradeId && gst.subjectId === subjectId) {
          if (!gradeNames.includes(gst.Group.Grade?.name)) {
            gradeNames.push(gst.Group.Grade?.name)
          }

          if (gradeids[gst.Group.gradeId]) {
            gradeids[gst.Group.gradeId][subjectId] = true
          } else {
            gradeids[gst.Group.gradeId] = { [subjectId]: true }
          }
        }
      })

      setCheckedGradesArray(gradeids);

      setSTSelectedGrades(gradeNames)
    } else {
      setCheckedGradesArray([])
    }

    /*
    if(subjectTInfo && subjectTInfo.Grades && subjectTInfo.Grades.length > 0){
      let gradeids = [];
      subjectTInfo.Grades.map((grade) => {
        if(grade.id){
          gradeids[grade.id] = true
        }
      })
      setCheckedGradesArray(gradeids);
    } else {
      setCheckedGradesArray([]);
    }
    */

    if (groupSubjectTeacher?.length > 0) {
      let groupids = [];

      let groupNames = [];

      groupSubjectTeacher.map(gst => {
        if(gst.groupId && gst.subjectId === subjectId) {
          groupNames.push(gst.Group.name)

          if (groupids[gst.groupId]) {
            groupids[gst.groupId][subjectId] = true
          } else {
            groupids[gst.groupId] = { [subjectId]: true }
          }
        }
      })

      setCheckedGroupsArray(groupids);

      setSTSelectedGroups(groupNames)
    } else {
      setCheckedGroupsArray([])
    }

    /*
    if(subjectTeacher && subjectTeacher.Groups && subjectTeacher.Groups.length > 0){
      let groupids = [];
      subjectTeacher.Groups.map((group) => {
        if(group.id){
          if (groupids[group.id]) {
            groupids[group.id][subjectId] = true
          } else {
            groupids[group.id] = { [subjectId]: true }
          }
        }
      })
      setCheckedGroupsArray(groupids);
    } else {
      setCheckedGroupsArray([])
    }
    */
    
  },[groupSubjectTeacher, subjectId, subjectTeacher]);

  const handleCheckGroup = (index, bool) => {
    const arr = checkedGroupsArray.map(v => v);
    if (arr[index]) {
      arr[index][subjectId] = bool;
    } else {
      arr[index] = { [subjectId]: bool }
    }
    setCheckedGroupsArray(arr);
  };

  const handleCheckGrade = (index, bool) => {
    const arr = checkedGradesArray.map(v => v);
    if (arr[index]) {
      arr[index][subjectId] = bool;
    } else {
      arr[index] = { [subjectId]: bool }
    }
    setCheckedGradesArray(arr);
  };

  const handleChecked = () => {
    if (subjectTeachers === 0) {
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

  const handleRemove = async () => {

    const listGroupsForSelectedST = allUsers.filter((user) => user.id === subjectTeacherId && user.Groups).map((opt) => opt.Groups)[0]; 
    
    const deleteSubjectTeacher = async () => {

      const config = {
        method: 'DELETE',
        url: `${baseUrl}/subjectTeachers/subject/${parseInt(subjectId)}/teacher/${parseInt(subjectTeacherId)}`,
        headers: {
          'Authorization': jwt,
          'Content-Type': 'application/json'
        }
      }
      await axios(config);
    };

    if(listGroupsForSelectedST && listGroupsForSelectedST.length > 0){
      let groupIds = listGroupsForSelectedST.map((group) => group.id);

      const deleteSubjectTeacherFromGroups = () => {
        groupIds.forEach(async id => {
          const data = {
            "groupId": parseInt(id),
            "subjectId": parseInt(subjectId),
            "userId": parseInt(subjectTeacherId)
          }
  
          const config = {
            method: 'DELETE',
            url: `${baseUrl}/groupSubjectTeachers/group/${data.groupId}/subject/${data.subjectId}/teacher/${data.userId}`,
            headers: {
              'Authorization': jwt,
              'Content-Type': 'application/json'
            }
          }
          await axios(config);
        });
      };

      try {
        await Promise.all([deleteSubjectTeacherFromGroups(), setTimeout(() => { deleteSubjectTeacher();})]);
        setUpdated(true);
      } catch (e) {
        console.log(e);
      }

    } else {

      try {
        deleteSubjectTeacher();
        setUpdated(true);
      } catch (e) {
        console.log(e);
      }

    }
  };

  useEffect(() => {
    if (uncheckAll) {
      setChecked(index, false);
      setUncheckAll(false);
    }
  }, [uncheckAll, setUncheckAll]);

  const renderLevelGrades = (grades, level, levelKeyIdx) => {
    if(grades) {
      return grades.map((grade, key) => {
        if(grade.groups && grade.groups.length > 0) {
          return (
            <GradesList
              jwt={jwt}
              setUpdated={setUpdated}
              gradeId={grade.id}
              groupSubjectTeacher={groupSubjectTeacher}
              levelName={level.name}
              campusId={campusId}
              subjectId={subjectId}
              groups={groups}
              gradeGroups={grade.groups}
              subjectTeacherId={subjectTeacherId}
              checked={checkedGradesArray[grade.id] ? checkedGradesArray[grade.id][subjectId] : false}
              levelIndex={levelKeyIdx}
              index={key}
              currentRowIdx={index}
              setChecked={handleCheckGrade}
              grade={grade}
            />
          );
        }
      })
    }
     
    return null;
  }

  const renderGradesOfLevel = () => {
    if(levelsList && levelsList.length > 0) {
      return levelsList.map((level, levelKeyIdx) => {
        if(level.grades && level.grades.length > 0 && level.campusId === campusId) {
          return (
            <div style={{ padding: 5 }}>
              <span>{level.name}</span>
              {renderLevelGrades(level.grades, level, levelKeyIdx)}
            </div>
          )
        } 
      }) 
    }
    return null;
  }

  const renderLevelGradeGroups = (groups, grade, gradKeyIdx, levelKeyIdx) => {
    if(groups) {
      return groups.map((group, groupKeyIdx) => {
        if(group.gradeId  === grade.id){
          return (
            <GroupsList
              jwt={jwt}
              setUpdated={setUpdated}
              groupId={group.id}
              gradeName={grade.name}
              campusId={campusId}
              subjectId={subjectId}
              subjectTeacherId={subjectTeacherId}
              gradeIndex={gradKeyIdx}
              levelIndex={levelKeyIdx}
              currentRowIdx={index}
              checked={checkedGroupsArray[group.id] ? checkedGroupsArray[group.id][subjectId] : false}
              index={groupKeyIdx}
              setChecked={handleCheckGroup}
              group={group}
            />
          )
        }
      });     
    }
    return null;
  }

  const renderGroupsByGrade = () => {
    if(levelsList && levelsList.length > 0) {
      return levelsList.map((level, levelKeyIdx) => {
        if(level.grades && level.grades.length > 0 && level.campusId === campusId) {
          return level.grades.map((grade, gradKeyIdx) => {
            if(level.id === grade.levelId && grade.groups && grade.groups.length > 0){
              return (
                <div style={{ padding: 5 }}>
                  <span>{grade.name}</span>
                  {renderLevelGradeGroups(grade.groups, grade, gradKeyIdx, levelKeyIdx)}
                </div>
              )
            }
          })
        }
      });
    }
    return null;
  }

  return (
    <tr key={`subject-teachers-table-tr-${ids}-${subjectTeacherId}-${index}`} id={`subject-teachers-table-tr-${ids}-${subjectTeacherId}-${index}`}>
      <td>
        <div className="form-group check-box">
            <input 
              type="checkbox" 
              id={`subject-teachers-table-td-${ids}-${subjectTeacherId}-${index}`}
              checked={checked} 
              onChange={handleChecked}  
            />
            <label for={`subject-teachers-table-td-${ids}-${subjectTeacherId}-${index}`}>HTML</label>
        </div>
      </td>
      <td>{`${subjectTInfo && subjectTInfo.name || ''} (${subjectTInfo && subjectTInfo.email || ''}) `}</td>
      <td>
        <div className="select-dropdown" id={`subject-teachers-table-td-dropdown-${ids}-${subjectTeacherId}-${index}`}>
          <ul>
            <li ref={refForGrades}>
              <div 
                name={`div-grades-${ids}-${subjectTeacherId}-${index}`}
                id={`div-grades-${ids}-${subjectTeacherId}-${index}`}
                onClick={(event) => {
                  if (isSelectedGradesDropdown){
                    setSelectedGradesDropdown(false);
                  } else{
                    setSelectedGradesDropdown(true);
                    setSelectedGroupsDropdown(false);
                  }
              }} className="droplink">
                {checkedGradesArray?.length > 0 && SThasSelectedGrades && SThasSelectedGrades.length !== 0 ? SThasSelectedGrades.join() : 'Select any'}
              </div>
              <ul 
                name={`dropdown-ul-${ids}-${subjectTeacherId}-${index}`} 
                id={`dropdown-ul-${ids}-${subjectTeacherId}-${index}`} 
                className={`dropdown-box ${isSelectedGradesDropdown ? 'show': ''}`}>
                <p>Grades</p>
                {levelsList && renderGradesOfLevel()}
              </ul>
            </li>
          </ul>
        </div>
      </td>
      <td>
      <div className="select-dropdown">
        <ul>
          <li ref={refForGroups}>
            <div 
             name={`div-groups-${ids}-${subjectTeacherId}-${index}`}
             id={`div-groups-${ids}-${subjectTeacherId}-${index}`}
             onClick={() => {
              if (isSelectedGroupsDropdown){
                setSelectedGroupsDropdown(false);
              } else {
                setSelectedGradesDropdown(false);
                setSelectedGroupsDropdown(true);
              }
             }} className="droplink">
              {checkedGroupsArray?.length > 0 && SThasSelectedGroups && SThasSelectedGroups.length !== 0 ? SThasSelectedGroups.join() : 'Select any'}
            </div>
            <ul className={`dropdown-box ${isSelectedGroupsDropdown ? 'show': ''}`}>
              <p>Groups</p>
              {levelsList && renderGroupsByGrade()}
            </ul>
          </li>
        </ul>
        </div>
      </td>
    <td>
      <button 
          type="button" 
          id={`subject-teachers-remove-${ids}-${index}`} 
          className="remove" 
          onClick={() => handleRemove()}>
          Remove
      </button>
    </td>
  </tr>
  );
};

export default TeacherTableRow;
