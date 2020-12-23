import React, { useEffect, useState } from "react";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../../services/localStorageService";

import { useDict } from "../../UI/Translations"

import './FilterByModal.css'
import { findInTree } from "../../../utils";

const baseUrl = process.env.REACT_APP_BASE_URL;
const FilterByModal = (props) => {
  const [mainDivisionsList, setMainDivisionsList] = useState([]);
  const [mainRolesList, setMainRolesList] = useState([]);
  const [role, setRole] = useState("");
  const [campus, setCampus] = useState("");
  const [level, setLevel] = useState("");
  const [grade, setGrade] = useState("");
  const [group, setGroup] = useState("");
  const [afterSchoolGroup, setAfterSchoolGroup] = useState("");

  const dict = useDict("/staff-members-page")

  const getDivisions = async () => {
    const token = getTokenFromLocalStorage();
    const config = {
      method: "get",
      url: `${baseUrl}/schoolInfo/divisions/all`,
      headers: {
        Authorization: token,
      },
    };
    try {
      const { data } = await axios(config);
      console.log(data);
      setMainDivisionsList(data);
    } catch (err) {
      console.error(err.toString());
    }
  };

  const getRoles = async () => {
    const token = getTokenFromLocalStorage();
    const config = {
      method: "get",
      url: `${baseUrl}/roles`,
      headers: {
        Authorization: token,
      },
    };
    try {
      const { data } = await axios(config);
      setMainRolesList(data);
    } catch (err) {
      console.error(err.toString());
    }
  };

  useEffect(() => {
    getDivisions();
    getRoles();
  }, []);

  useEffect(() => {
    if(props.filterBy){
      if('role' in props.filterBy && props.filterBy.role){
        setRole(parseInt(props.filterBy.role))
      }

      if('campus' in props.filterBy && props.filterBy.campus){
        setCampus(parseInt(props.filterBy.campus));
      }

      if('level' in props.filterBy && props.filterBy.level){
        setLevel(parseInt(props.filterBy.level))
      }

      if('grade' in props.filterBy && props.filterBy.grade){
        setGrade(parseInt(props.filterBy.grade))
      }

      if('group' in props.filterBy && props.filterBy.group){
        setGroup(parseInt(props.filterBy.group));
      }

      if('aSGroup' in props.filterBy && props.filterBy.aSGroup){
        setAfterSchoolGroup(parseInt(props.filterBy.aSGroup))
      }
    }
  }, [props.filterBy]);

  useEffect(() => { }, [mainDivisionsList]);

  const filterListByParam = () => {
    if(props.filterBy){
      let filteredArray = [];
      if(('role' in props.filterBy && props.filterBy.role) && ('campus' in props.filterBy && props.filterBy.campus)){
        filteredArray = props.staffList.filter((staffItem) => {
          if((staffItem.Role && 'id' in staffItem.Role && staffItem.Role.id &&staffItem.Role.id === role) && (staffItem.Campus && 'id' in staffItem.Campus && staffItem.Campus.id && staffItem.Campus.id === campus)){
            if('level' in props.filterBy && props.filterBy.level !== null){
              if(staffItem.Levels && staffItem.Levels.length > 0 && staffItem.Levels.some(l => l.id === level)){
                if('grade' in props.filterBy && props.filterBy.grade !== null){
                  if(staffItem.Grades && staffItem.Grades.length > 0 && staffItem.Grades.some(g => g.id === grade)){
                    if('group' in props.filterBy && props.filterBy.group !== null){
                      if(staffItem.Groups && staffItem.Groups.length > 0 && staffItem.Groups.some(g => g.id === group)){
                        return staffItem;
                      }
                      return;
                    }
                    return staffItem;
                  }
                  return;
                }
                return staffItem;
              }
              return;
            } else if('aSGroup' in props.filterBy && props.filterBy.aSGroup !== null){
              if (staffItem.AfterSchoolGroups && staffItem.AfterSchoolGroups.length > 0 && staffItem.AfterSchoolGroups.some(aSG => aSG.id === afterSchoolGroup)) {
                return staffItem;
              }
              return;
            }
            return staffItem;
          }
          return;
        });
      } else if(('role' in props.filterBy && props.filterBy.role === null) && ('campus' in props.filterBy && props.filterBy.campus)) {
        filteredArray = props.staffList.filter((staffItem) => {
          if(staffItem.Campus && 'id' in staffItem.Campus && staffItem.Campus.id && staffItem.Campus.id === campus){
            if('level' in props.filterBy && props.filterBy.level !== null){
              if(staffItem.Levels && staffItem.Levels.length > 0 && staffItem.Levels.some(l => l.id === level)){
                if('grade' in props.filterBy && props.filterBy.grade !== null){
                  if(staffItem.Grades && staffItem.Grades.length > 0 &&staffItem.Grades.some(g => g.id === grade)){
                    if('group' in props.filterBy && props.filterBy.group !== null){
                      if(staffItem.Groups && staffItem.Groups.length > 0 &&staffItem.Groups.some(g => g.id === group)){
                        return staffItem;
                      }
                      return;
                    }
                    return staffItem;
                  }
                  return;
                }
                return staffItem;
              }
              return;
            } else if('aSGroup' in props.filterBy && props.filterBy.aSGroup !== null){
              if (staffItem.AfterSchoolGroups && staffItem.AfterSchoolGroups.length > 0 && staffItem.AfterSchoolGroups.some(aSG => aSG.id === afterSchoolGroup)) {
                return staffItem;
              }
              return;
            }
            return staffItem;
          }
          return;
        });
      } else if('role' in props.filterBy && props.filterBy.role){
        filteredArray = props.staffList.filter((staffItem) => {
          if(staffItem.Role && 'id' in staffItem.Role && staffItem.Role.id && staffItem.Role.id === role) {
            return staffItem;
          }
        });
      }
      props.setApplied(true)
      props.newStaffList(filteredArray);
      props.setCurrentPageFromFilter(1);
    }
  };

  useEffect(() => {
  }, [role, campus, level, grade, group, afterSchoolGroup]);


  return (
    <>
    <div className="filter-model-open">
      <div style={{ padding: "10px", minWidth: "500px" }} className="delete-confirmation-modal-container">
        <div className="filter-headers">
          <h2 className="filter-model-h2">{dict("filter-modal/title")}</h2>
          <button
           style={{ opacity: `${Object.keys(props.filterBy).length === 0 ? 0.5 : 1}`}} className="createButton" 
           disabled={Object.keys(props.filterBy).length === 0} onClick={() => { 
                props.setUpdated(true); 
                props.closeFilterModal(false); 
                props.setCurrentPageFromFilter(null);
                props.setFilterBy({})
                props.setApplied(false);
                }}>{dict("filter-modal/button/reset")}</button>
        </div>
        <div className="filter-model-grey-line"></div>
        <div className="filter-model-body">
          <p style={{ marginTop: "10px" }} className="staff-list-modify-select-label">{dict("filter-modal/input/role-filter")}</p>
          <select className="staff-list-modify-select-bar select-filter-model" value={props.filterBy && props.filterBy.role || ''} onChange={(e) => {
            setRole(parseInt(e.target.value));
            props.setFilterBy({
              role: e.target.value ? parseInt(e.target.value) : null,
              campus: campus || null
            });
            // props.setUpdated(true);
          }}>
            <option value={""}>{`-- ${dict("filter-modal/input/placeholder")} --`}</option>
            {mainRolesList.map((role) => {
              return (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              );
            })}
          </select>
          <p style={{ marginTop: "10px" }} className="staff-list-modify-select-label">{dict("filter-modal/input/campus-filter")}</p>
          <select className="staff-list-modify-select-bar select-filter-model" value={props.filterBy && props.filterBy.campus || ''} onChange={(e) => {
            setCampus(parseInt(e.target.value));
            props.setFilterBy({
              role: role || null,
              campus: parseInt(e.target.value)
            });
          }}>
            <option className="staff-list-modify-select-bar select-filter-model" value="">{`-- ${dict("filter-modal/input/placeholder")} --`}</option>
            {mainDivisionsList.length !== 0
              ? mainDivisionsList.campuses.map((campus) => {
                return (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                );
              })
              : null}
          </select>
          <p style={{ marginTop: "10px" }} className="staff-list-modify-select-label">{dict("filter-modal/input/level-filter")}</p>
          <select className="staff-list-modify-select-bar select-filter-model" value={props.filterBy && props.filterBy.level || ''} onChange={(e) => {
            setLevel(parseInt(e.target.value));
            props.setFilterBy({
              ...props.filterBy,
              level: parseInt(e.target.value),
              grade: null,
              group: null
            });
          }}>
            <option value="">{`-- ${dict("filter-modal/input/placeholder")} --`}</option>
            {campus && mainDivisionsList.length !== 0
              ? mainDivisionsList.levels.filter((l) => l.campusId === parseInt(campus)).map((level) => {
                return (
                  <option key={`${level.id}-${level.name}-${campus}`} value={level.id}>
                    {level.name}
                  </option>
                );
              })
              : null}
          </select>
          <p style={{ marginTop: "10px" }} className="staff-list-modify-select-label">{dict("filter-modal/input/grade-filter")}</p>
          <select
            onChange={(e) => {
              setGrade(parseInt(e.target.value));
              props.setFilterBy({
                ...props.filterBy,
                grade: parseInt(e.target.value),
                group: null
              });
            }}
            value={props.filterBy && props.filterBy.grade || ''}
            className="staff-list-modify-select-bar select-filter-model"
          >
            <option value="">{`-- ${dict("filter-modal/input/placeholder")} --`}</option>
            {level && mainDivisionsList.length !== 0
              ? mainDivisionsList.grades.filter((g) => g.levelId === parseInt(level)).map((grade) => {
                return (
                  <option key={`${grade.id}-${grade.name}-${level}-${campus}`} value={grade.id}>
                    {grade.name}
                  </option>
                );
              })
              : null}
          </select>
          <p style={{ marginTop: "10px" }} className="staff-list-modify-select-label">{dict("filter-modal/input/group-filter")}</p>
          <select
            onChange={(e) => {
              setGroup(parseInt(e.target.value));
              props.setFilterBy({
                ...props.filterBy,
                group: parseInt(e.target.value)
              });
            }}
            value={props.filterBy && props.filterBy.group || ''}
            className="staff-list-modify-select-bar select-filter-model"
          >
            <option value="">{`-- ${dict("filter-modal/input/placeholder")} --`}</option>
            {grade && mainDivisionsList.length !== 0
              ? mainDivisionsList.groups.filter((g) => g.gradeId === parseInt(grade)).map((group) => {
                return (
                  <option key={`${group.id}-${group.name}-${grade}-${level}-${campus}`} value={group.id}>
                    {group.name}
                  </option>
                );
              })
              : null}
          </select>
          <p style={{ marginTop: "10px" }} className="staff-list-modify-select-label">{dict("filter-modal/input/after-school-group-filter")}</p>
          <select value={props.filterBy && props.filterBy.aSGroup || ''} className="staff-list-modify-select-bar select-filter-model" onChange={(e) => {
            setAfterSchoolGroup(parseInt(e.target.value));
            props.setFilterBy({
              ...props.filterBy,
              aSGroup: parseInt(e.target.value)
            });
          }}>
            <option value="">{`-- ${dict("filter-modal/input/placeholder")} --`}</option>
            {campus && mainDivisionsList.length !== 0
              ? mainDivisionsList.afterSchoolGroups.filter((aSG) => aSG.campusId === parseInt(campus)).map((afterSchoolGroup) => {
                return (
                  <option key={`${afterSchoolGroup.id}-${afterSchoolGroup.name}-${campus}`} value={afterSchoolGroup.id}>
                    {afterSchoolGroup.name}
                  </option>
                );
              })
              : null}
          </select>
        </div>
        <div className="filter-model-grey-line"></div>
        <div className="filter-model-footer">
          <div className="buttons">
            <button
              className="cancel-button"
              onClick={() => {
                props.closeFilterModal(false);
                props.setCurrentPageFromFilter(null);
                props.setFilterBy({});
                props.setApplied(false);
              }}
            >
              {dict("filter-modal/button/cancel")}
            </button>
            <button disabled={!campus && !role} style={{ opacity: `${!campus && !role ? 0.5 : 1}`}} className="createButton" onClick={() => { 
              filterListByParam(); 
              props.closeFilterModal();
            }}>{dict("filter-modal/button/apply")}</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FilterByModal;
