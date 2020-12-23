import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";

// modals
import { FormModal } from "../../../../UI/AddStaffModal";
import LoadingSpinner from "../../../../UI/LoadingSpinner";

import ListRow from './ListRow/ListRow';

import '../../TeachersConfig.css';

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddGroupTeachers = props => {

  const { 
    subjectTeachers, 
    subjectId,
    jwt, 
    subjectName,
    campusId,
    setUpdated,
    users,
    setWarningForSTNotInCampus
    } = props;
 
  const [loading, setLoading] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [checkedArray, setCheckedArray] = useState([]);

  const [filteredTeachers, setFilteredTeachers] = useState(users);
  let filteredTeachersBySubject = filteredTeachers.filter((opt) => ((opt.campusId === campusId || opt.campusId === null) && (opt.roleId === 6 || opt.roleId === 7)));

  // && ((opt.Subjects && opt.Subjects.some((s) => s.id !== subjectId)) || (opt.Subjects === null)) 

  useEffect(() => {
    setFilteredTeachers(users);
    setCheckedArray(filteredTeachersBySubject.map(teacher => false))
  },[users]);

  const handleCheck = (index, bool) => {
    let tempCheckboxes = [...checkedArray];
    tempCheckboxes[index] = bool;
    setCheckedArray([...tempCheckboxes]);
  };

  const filterIt = (searchKey) => filteredTeachersBySubject.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0);

  const handleChange = (event) => {
    setSearchByName(event.target.value)

    if(event.target.value){
      let filteredArrayOfTeachers = filterIt(event.target.value);
      setFilteredTeachers(filteredArrayOfTeachers);
    } else {
      setFilteredTeachers(users);
    }
  }

  const renderIndividualTeacherCheckbox = () => {
    return filteredTeachersBySubject.map((main_teacher, keyIndex) => {
      return (
        <ListRow 
          checked={checkedArray[keyIndex]}
          index={keyIndex}
          setChecked={handleCheck}
          teacher={main_teacher}
        />
      );
    })
  }

  const handleAdd = async () => {
    const tempTeachers = filteredTeachersBySubject.filter((v, i) => checkedArray[i]);
    const ids = tempTeachers.map(x => x.id);
    if(tempTeachers && tempTeachers.length > 0 && !tempTeachers.some(x => x.campusId)){
      setWarningForSTNotInCampus(true);
    } else {
      setLoading(true);
      const AddSelectedGroupTeacherById = async () => {
        ids.forEach(async id => {
          const config = {
            method: 'POST',
            url: `${baseUrl}/subjectTeachers`,
            data: {
              "subjectId": subjectId,
              "userId": parseInt(id)
            },
            headers: {
              'Authorization': jwt,
              'Content-Type': 'application/json'
            }
          }
  
          const { data } = await axios(config);
          
          if((data && data.userId) && (users.filter((user) => user.id === data.userId && user.roleId === 6))){
            const idsOfGroups = users.filter((user) => user.id === data.userId && user.roleId === 6).map((u) => u.Groups)[0];
            if(idsOfGroups && idsOfGroups.length > 0){
              const handleAdd = async () => {
                idsOfGroups.forEach(async g => {
                  const config = {
                    method: 'POST',
                    url: `${baseUrl}/groupSubjectTeachers`,
                    data: {
                      "subjectId": parseInt(subjectId),
                      "groupId": parseInt(g.id),
                      "userId": parseInt(data.userId)
                    },
                    headers: {
                      'Authorization': jwt,
                      'Content-Type': 'application/json'
                    }
                  }
                  await axios(config);
                });
              }
    
              try {
                await Promise.all([handleAdd()])
                return;
              } catch (err) {
                console.error(err);
                return;
              }
            }
          } 
        });	
      }

      try {
        await Promise.all([AddSelectedGroupTeacherById()]);
        setErrorMessage("");
        setLoading(false);
        setUpdated(true);
        props.closeModal();
      } catch (e) {
        console.log(e);
        setErrorMessage(e.message.toString());
        setSuccessMessage("");
        setLoading(false);
      }
    }
  }


  return (
    <FormModal
        open={props.isModalOpenForSubjectTeachers}
        onClose={props.closeModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Add Subject Professors</h5>
          <span className="modal-mini-title">{subjectName}</span>
        </div>
        {loading ? <LoadingSpinner /> : 
        <>
          <div class="modal-body">
              <form className="add-main-teachers-form" onSubmit={() => {}}>
                <div className="searchbox">
                  <a href="javascript:void(0)" className="search-icon">
                      <i className="fa fa-search" aria-hidden="true"></i>
                  </a>
                  <input 
                    type="text"
                    value={searchByName}
                    onChange={handleChange} 
                    placeholder="Search staff" />
                </div>
                <div className="checkbox-row">
                  {filteredTeachersBySubject && filteredTeachersBySubject.length > 0 ? renderIndividualTeacherCheckbox() : (<span style={{ fontSize: 14 }}>No data(s) found</span>) }
                </div>
                <p style={{ color: "red" }}>{errorMessage}</p>
              </form>
          </div>
          <div className="modal-footer">
              <div class="buttons">
                <button class="cancelButton" type="button" onClick={props.closeModal}>Cancel</button>
                <button class="createButton" onClick={handleAdd}>Add</button>
              </div>
          </div>
        </>}
    </FormModal>
        
  )
}

export default AddGroupTeachers;
