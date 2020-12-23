import React, { useState, useContext, useEffect } from 'react'
import axios from "axios";

// modals
import { FormModal } from "../../../../UI/AddStaffModal";
import LoadingSpinner from "../../../../UI/LoadingSpinner";

import ListRow from './ListRow/ListRow';

import '../../TeachersConfig.css';

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddAfterSchoolGroupTeachers = props => {

  const { 
    asTeachers, 
    setUpdated,
    groupId,
    campusId,
    jwt, 
    groupName,
    groupSubjectTeachers,
    } = props;
 
  const [loading, setLoading] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [checkedArray, setCheckedArray] = useState([]);

  const [filteredTeachers, setFilteredTeachers] = useState(asTeachers);

  let filteredTeachersByCampus = filteredTeachers.filter((opt) => (opt.campusId === campusId || opt.campusId === null));

  useEffect(() => {
    setFilteredTeachers(asTeachers);
  },[asTeachers]);

  useEffect(() => {
    setCheckedArray(filteredTeachersByCampus.map(teacher => false))
  },[props.isModalOpenForAfterSchoolTeachers]);

  const handleCheck = (index, bool) => {
    let tempCheckboxes = [...checkedArray];
    tempCheckboxes[index] = bool;
    setCheckedArray([...tempCheckboxes]);
  };

  const filterIt = (searchKey) => filteredTeachersByCampus.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0);

  const handleChange = (event) => {
    setSearchByName(event.target.value)

    if(event.target.value){
      let filteredArrayOfTeachers = filterIt(event.target.value);
      setFilteredTeachers(filteredArrayOfTeachers);
    } else {
      setFilteredTeachers(asTeachers);
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
    setLoading(true);
    const AddAfterSchoolGroupSelectedTeachersById = () => {
      ids.forEach(async id => {
        const config = {
          method: 'POST',
          url: `${baseUrl}/afterSchoolGroupTeachers`,
          data: {
            "groupId": groupId,
            "userId": id
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
      await Promise.all([AddAfterSchoolGroupSelectedTeachersById()]);
      setErrorMessage("");
      setLoading(false);
      setUpdated(true);
      props.closeModal();
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message.toString());
      setSuccessMessage("");
      setLoading(false);
    }
  }

  return (
    <FormModal
        open={props.isModalOpenForAfterSchoolTeachers}
        onClose={props.closeModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Add After School Professors</h5>
          <span className="modal-mini-title">{groupName}</span>
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
                  {filteredTeachersByCampus && filteredTeachersByCampus.length > 0 ? renderIndividualTeacherCheckbox() : (<span style={{ fontSize: 14 }}>No data(s) found</span>) }
                </div>
                <p style={{ color: "red" }}>{errorMessage}</p>
              </form>
          </div>
          <div className="modal-footer">
              <div className="buttons">
                <button className="cancelButton" type="button" onClick={props.closeModal}>Cancel</button>
                <button className="createButton" onClick={handleAdd}>Add</button>
              </div>
          </div>
        </>}
    </FormModal>
        
  )
}

export default AddAfterSchoolGroupTeachers;
