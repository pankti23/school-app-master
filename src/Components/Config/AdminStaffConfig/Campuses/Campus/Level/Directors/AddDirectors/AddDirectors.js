import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";

// modals
import { FormModal } from "../../../../../../../UI/AddStaffModal";
import ListRow from './ListRow';

import '../../../../../AdminStaffConfig.css';

import { UserContext } from '../../../../../../../../Contexts/UserContext';

import { useDict } from "../../../../../../../UI/Translations"

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddDirectors = props => {
  
  const {
    ids,
    users,
    setUpdated,
    campusId,
    campusName,
    campusKeyIdx,
    level,
    levelKeyIdx,
  } = props;
  
  const [searchByName, setSearchByName] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  
  const [checkedArray, setCheckedArray] = useState([]);
  
  const [usersList, setUsersList] = useState(users);

  const dict = useDict("/configuration-page/admin-staff")
  
  const filteredUsers = usersList.filter((opt) => opt.roleId === 5 && opt.campusId === campusId && (opt.Levels && opt.Levels.length > 0 && opt.Levels.some((l) => l.id !== level.id)));

  const userData = useContext(UserContext);

  useEffect(() => {
    setUsersList(users);
    setCheckedArray(filteredUsers.map(principal => false))
  },[users]);

  const handleCheck = (index) => {
    setCheckedArray(checkedArray.map((principal, i) => i === index ? true : false));
  };

  const filterIt = (searchKey) => filteredUsers.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0);

  const handleChange = (event) => {
    setSearchByName(event.target.value)

    if(event.target.value){
      let filteredArrayOfPrincipals = filterIt(event.target.value);
      setUsersList(filteredArrayOfPrincipals);
    } else {
      setUsersList(users);
    }
  }

  const renderAddPrincipalRow = () => {
    return filteredUsers.map((user, userKeyIdx) => {
      return (
        <ListRow 
          checked={checkedArray[userKeyIdx]}
          index={userKeyIdx}
          setChecked={handleCheck}
          principal={user}
        />
      );
    })
  }

  const handleAdd = async () => {
    const tempPrincipals = filteredUsers.filter((v, i) => checkedArray[i]);
    const ids = tempPrincipals.map(x => x.id);

    const config = {
      method: 'PUT',
      url: `${baseUrl}/levels/${level.id}`,
      data: {
        "principalId": parseInt(ids.join()),
        "campusId": parseInt(campusId),
      },
      headers: {
        'Authorization': userData.jwt,
        'Content-Type': 'application/json'
      }
    }

    try {
      await axios(config);
      setErrorMessage("");
      setUpdated(true);
      props.closeModal();
    } catch (err) {
      console.error(err)
      setErrorMessage(err.toString());
    }
    
  }

  return (
    <FormModal
        open={props.isOpenModalForStaffMember}
        onClose={props.closeModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">{dict("level/add-staff-modal/title")}</h5>
          <span className="modal-mini-title">{`${level.name} ${dict("level/add-staff-modal/subtitle")}`}</span>
        </div>
        <div class="modal-body">
          <form className="add-staff-members-form" onSubmit={() => {}}>
            <div className="searchbox">
              <a href="javascript:void(0)" className="search-icon">
                  <i className="fa fa-search" aria-hidden="true"></i>
              </a>
              <input 
                type="text"
                id={`search-by-${ids}`}
                value={searchByName}
                onChange={handleChange} 
                placeholder={dict("level/add-staff-modal/search-input")} />
            </div>
            <div className="checkbox-row">
              {filteredUsers && filteredUsers.length > 0 ? renderAddPrincipalRow() : null}
            </div>
            <p style={{ color: "red" }}>{errorMessage}</p>
          </form>
        </div>
        <div className="modal-footer">
            <div class="buttons">
              <button class="cancelButton" type="button" onClick={props.closeModal}>{dict("level/add-staff-modal/button/cancel")}</button>
              <button class="createButton" onClick={handleAdd}>{dict("level/add-staff-modal/button/add")}</button>
            </div>
        </div>
    </FormModal>
  );
}

export default AddDirectors;
