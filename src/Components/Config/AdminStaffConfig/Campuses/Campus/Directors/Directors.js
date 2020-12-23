import React, { useState, useContext, useEffect } from 'react';

import plusimg from '../../../../../../SchoolAPP Assets/plus-black.svg';
import MinimizeIcon from '../../../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../../../SchoolAPP Assets/BlackPlus';

import AddStaffMembers from './AddDirectors';
import DirectorsTableList from './DirectorsTableList';

import { useDict } from '../../../../../UI/Translations'

import '../../../AdminStaffConfig.css';

const Directors = props => {

  const { ids, campusId, campusName, campusKeyIdx, users, campusesPrincipals, setUpdated } = props;

  const dict = useDict("/configuration-page/admin-staff")

  // const [minimize, setMinimized] = useState(false);
  const [addStaffModal, setAddStaffModal] = useState(false);

  // const handleMinimizeClick = () => {
  //   setMinimized(!minimize);
  // };

  return (
    <React.Fragment>
      {/* id={`accordion-${ids}-1`}  */}
      <div> 
        <div className="card" id={`card-${ids}-1`}>
          <div className="card-header" id={`accordion-${campusId}-${campusName}-1-heading-${campusKeyIdx}-1`}>
            <h5 className="mb-0">
              {dict("campus/title")}
            </h5>
            <div className="btn-popup">
              <button type="button" className="btn-addstaff" onClick={() => setAddStaffModal(true)}>
                <img src={plusimg} />
                {dict("campus/add-staff-button")}
              </button>
            </div>
            {/* <div className="pull-right">
              <a 
                className="collapsed btn-collapse btn-open" 
                onClick={handleMinimizeClick} role="button" data-toggle="collapse" href={`#accordion-${campusId}-${campusName}-collapse-${campusKeyIdx}-1`}aria-expanded="false" aria-controls={`accordion-${campusId}-${campusName}-collapse-${campusKeyIdx}-1`}>
                  {minimize ? (
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
                  {minimize ? "Minimize" : "Open"}
              </a>
            </div> */}
          </div>
          {/* <div id={`accordion-${campusId}-${campusName}-collapse-${campusKeyIdx}-1`} className="collapse" data-parent={`#accordion-${ids}-1`} aria-labelledby={`accordion-${campusId}-${campusName}-1-heading-${campusKeyIdx}-1`}> */}
            <div className="card-body">
              <DirectorsTableList
                campusId={campusId}
                campusName={campusName}
                campusKeyIdx={campusKeyIdx}
                ids={ids}
                campusesPrincipals={campusesPrincipals}
                setUpdated={setUpdated}
              />
            </div>
          {/* </div> */}
        </div>
      </div>
      <AddStaffMembers 
        isOpenModalForStaffMember={addStaffModal}
        closeModal={() => setAddStaffModal(false)}
        ids={ids}
        users={users}
        setUpdated={setUpdated}
        campusId={campusId}
        campusName={campusName}
        campusKeyIdx={campusKeyIdx}
      />
    </React.Fragment>
  )
}

export default Directors;
