import React, { useState, useContext, useEffect } from 'react';

import '../AdminStaffConfig.css';

import Campus from './Campus';
import SchoolAdministrators from './SchoolAdministrators';

import { useDict } from "../../../UI/Translations"

const Campuses = props => {

  const { campuses, levels, users, campusesPrincipals, levelsPrincipals, schoolAdmins, setUpdated, queryStrings } =  props;

  const dict = useDict("/configuration-page/admin-staff")

  return (
    <div className="admin-staff-config-body">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            {dict("school/title")}
          </h5>
          <SchoolAdministrators schoolAdmins={schoolAdmins} />
        </div>
      </div>
      {
        campuses.map((campus, campusKeyIdx) => {
          return (
            <Campus 
              campusInfo={campus}
              campusKeyIdx={campusKeyIdx}
              queryStrings={queryStrings}
              levels={levels}
              users={users}
              campusesPrincipals={campusesPrincipals}
              levelsPrincipals={levelsPrincipals}
              setUpdated={setUpdated}
            />
          )
        })
      }
    </div>
  )
}

export default Campuses;
