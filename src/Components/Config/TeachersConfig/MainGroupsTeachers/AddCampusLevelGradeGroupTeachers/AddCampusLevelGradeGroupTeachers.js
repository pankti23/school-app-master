import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";

// modals
import { FormModal } from "../../../../UI/AddStaffModal";
import LoadingSpinner from "../../../../UI/LoadingSpinner";

import ListRow from './ListRow/ListRow';

import TeacherReplacementConfirmation from '../../TeacherReplacementConfirmation/TeacherReplacementConfirmation'
import WarningIfAlreadyAdded from '../../WarningIfAlreadyAdded/WarningIfAlreadyAdded'

import '../../TeachersConfig.css';

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddCampusLevelGradeGroupTeachers = props => {

  const { 
    users, 
    mainTeachers,
    campusId, 
    levelId, 
    gradeId, 
    groupId,
    jwt,
    setUpdated, 
    teachers,
    groupName,
    groupSubjectTeachers,
    isMainTeacherExistInGroup,
    setMainTeacherExistInGroup
    } = props;
 
  const [loading, setLoading] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [checkedArray, setCheckedArray] = useState([]);

  const [filteredTeachers, setFilteredTeachers] = useState(mainTeachers);

  const [displayReplacementConfirmation, setDisplayReplacementConfirmation] = useState(false)
  const [isShowWarning, setWarningModalShowStatus] = useState(false);

  let filteredTeachersByCampus = filteredTeachers.filter((opt) => (opt.campusId === campusId || opt.campusId === null));

  useEffect(() => {
    setFilteredTeachers(mainTeachers);
    setCheckedArray(filteredTeachersByCampus.map(teacher => false))
  },[mainTeachers]);

  const handleCheck = (index) => {
    setCheckedArray(checkedArray.map((teacher, i) => i === index ? true : false));
  };

  const filterIt = (searchKey) => filteredTeachersByCampus.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0);

  const handleChange = (event) => {
    setSearchByName(event.target.value)

    if(event.target.value){
      let filteredArrayOfTeachers = filterIt(event.target.value);
      setFilteredTeachers(filteredArrayOfTeachers);
    } else {
      setFilteredTeachers(mainTeachers);
    }
  }

  const renderIndividualTeacherCheckbox = () => {
    return filteredTeachersByCampus.map((main_teacher, keyIndex) => {
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
    const tempTeachers = filteredTeachersByCampus.filter((v, i) => checkedArray[i]);
    const ids = tempTeachers.map(x => x.id);

    console.log(checkedArray)
    
    const config = {
      method: 'PUT',
      url: `${baseUrl}/groups/${groupId}`,
      data: {
        "name": groupName,
        "gradeId": gradeId,
        "mainTeacherId": parseInt(ids.join())
      },
      headers: {
        'Authorization': jwt,
        'Content-Type': 'application/json'
      }
    }
    setDisplayReplacementConfirmation(false)
    setWarningModalShowStatus(false)
    setLoading(true);
    try {
      const { status, data } = await axios(config);
      console.log(data)
      setErrorMessage("");
      setLoading(false);
      setUpdated(true);
      props.closeModal();
    } catch (err) {
      console.error(err)
      setErrorMessage(err.toString());
      setSuccessMessage("");
      setLoading(false);
    }

    setMainTeacherExistInGroup({})
  }

  const checkTeachers = () => {
    if (teachers.length > 0) {
      setDisplayReplacementConfirmation(true)
    } else {
      checkGroups()
    }
  }

  const checkGroups = () => {
    const selectedTeacherId = filteredTeachersByCampus.filter((v, i) => checkedArray[i]).map(v => v.id)[0]

    setDisplayReplacementConfirmation(false)

    if (selectedTeacherId) {
      mainTeachers
        .filter((m) => m.id === selectedTeacherId)
        .map((mainTeacher) => {
          if (
            mainTeacher &&
            mainTeacher.Groups &&
            mainTeacher.Groups.length > 0
          ) {
            setWarningModalShowStatus(true);
            setMainTeacherExistInGroup(mainTeacher);
          }
        })
    } else {
      handleAdd()
    }
  }


  return (
    <>
      <FormModal
          open={props.isOpenModalForMainTeachers}
          onClose={props.closeModal}
        >
          <div className="modal-header">
            <h5 className="modal-title">Add full professors</h5>
            <span className="modal-mini-title">{props.groupName}</span>
          </div>
          {loading ? <LoadingSpinner /> : 
          <>
            <div className="modal-body">
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
                    {filteredTeachersByCampus && filteredTeachersByCampus.length > 0 ? renderIndividualTeacherCheckbox() : (<span style={{ fontSize: 14 }}>No data(s) found</span>)}
                  </div>
                  <p style={{ color: "red" }}>{errorMessage}</p>
                </form>
            </div>
            <div className="modal-footer">
                <div className="buttons">
                  <button className="cancelButton" type="button" onClick={props.closeModal}>Cancel</button>
                  <button className="createButton" onClick={checkTeachers}>Add</button>
                </div>
            </div>
          </>}
      </FormModal>

      <TeacherReplacementConfirmation display={displayReplacementConfirmation} handleClose={() => setDisplayReplacementConfirmation(false)} handleConfirm={checkGroups} />

      <WarningIfAlreadyAdded isModalOpen={isShowWarning} selectedMainTeacher={isMainTeacherExistInGroup} closeModal={() => {
        setWarningModalShowStatus(false);
        setMainTeacherExistInGroup({});
      }} handleAdd={handleAdd} />
    </>
  )
}

export default AddCampusLevelGradeGroupTeachers;
