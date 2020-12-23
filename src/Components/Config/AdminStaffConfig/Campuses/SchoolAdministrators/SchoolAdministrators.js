import React, { useState, useContext, useEffect } from 'react';

// import plusimg from '../../../../../SchoolAPP Assets/plus-black.svg';
import MinimizeIcon from '../../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';

// import AddStaffMembers from './AddSchoolAdministrators';
import AdministratorsTableList from './AdministratorsTableList';

import { useDict } from "../../../../UI/Translations"

import '../../AdminStaffConfig.css';

const SchoolAdministrators = props => {

  const { schoolAdmins } = props;

  const [minimize, setMinimized] = useState(false);
  // const [addStaffModal, setAddStaffModal] = useState(false);

  const dict = useDict("/configuration-page/admin-staff")

  const handleMinimizeClick = () => {
    setMinimized(!minimize);
  };

  return (
    <React.Fragment>
      <div id={`accordion-school-administrators-2`} style={{ marginTop: 15 }}>
        <div className="card" id={`card-school-administrators-2`}>
          <div className="card-header" id={`accordion-school-administrators-2-heading-2`}>
            <h5 className="mb-0">
              {dict("school/admin/title")}
            </h5>
            {/* <div className="btn-popup">
              <button type="button" className="btn-addstaff" onClick={() => setAddStaffModal(true)}>
                <img src={plusimg} />
                Add Staff
              </button>
            </div> */}
            <div className="pull-right">
              <a 
                className="collapsed btn-collapse btn-open" 
                onClick={handleMinimizeClick} role="button" data-toggle="collapse" href={`#accordion-school-administrators-collapse-2`}aria-expanded="false" aria-controls={`accordion-school-administrators-collapse-2`}>
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
            </div>
          </div>
          <div id={`accordion-school-administrators-collapse-2`} className="collapse" data-parent={`#accordion-school-administrators-2`} aria-labelledby={`accordion-school-administrators-2-heading-2`}>
            <div className="card-body">
              <AdministratorsTableList schoolAdmins={schoolAdmins}/>
            </div>
          </div>
        </div>
      </div>
      {/* <AddStaffMembers isOpenModalForStaffMember={addStaffModal} closeModal={() => setAddStaffModal(false)} /> */}
    </React.Fragment>
  )
}

export default SchoolAdministrators;
