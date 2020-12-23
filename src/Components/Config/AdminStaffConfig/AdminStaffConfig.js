import React, {useState, useContext, useEffect} from 'react'
import queryString from 'query-string';

import AdminStaffConfigHeader from './AdminStaffConfigHeader';

import { getCampusList } from "../../../services/campusService";
import { getLevelList } from "../../../services/levelService";
import { getUsersList, getCampusPrincipalList, getLevelPrincipalList, getSchoolAdminsList } from '../../../services/userService';

import { setCurrentPage } from "../../../services/localStorageService";

import './AdminStaffConfig.css'
import LoadingSpinner from '../../UI/LoadingSpinner';
import Campuses from './Campuses';

const AdminStaffConfig = ({ location }) => {
  const queryStrings = queryString.parse(location.search);

  setCurrentPage(`/configuration-page/admin-staff${location.search}`);

  const [campusList, setCampusList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [campusPrincipalList, setCampusPrincipalList] = useState([]);
  const [levelPrincipalList, setLevelPrincipalList] = useState([]);
  const [schoolAdminList, setSchoolAdminList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  const [error, setError] = useState(false);

  const getDataFromServer = async () => {
    const promises = [
      getCampusList(),
      getLevelList(),
      getUsersList(),
      getCampusPrincipalList(),
      getLevelPrincipalList(),
      getSchoolAdminsList(),
    ];

    return Promise.all(promises);
  }

  const loadInitialData = () => {
    const getInitialData = async () => {
      const [
        campuses,
        levels,
        users,
        campusesPrincipals,
        levelsPrincipals,
        schoolAdmins
      ] = await getDataFromServer();

      setCampusList(campuses);
      setLevelsList(levels);

      setUsersList(users);
      setCampusPrincipalList(campusesPrincipals);
      setLevelPrincipalList(levelsPrincipals);
      
      setSchoolAdminList(schoolAdmins);

      setIsLoading(false);
    }

    try {
      getInitialData();
      if (updated) {
        setUpdated(false);
      }
    } catch (e) {
      console.log("AdminStaffConfig Component Error:", e);
      setIsLoading(false);
      setError(true);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [updated]);

  return (
    <div className="admin-staff-config-container">
      <AdminStaffConfigHeader/>
      {isLoading ? <LoadingSpinner /> : 
      <Campuses 
        campuses={campusList}
        levels={levelsList}
        setUpdated={setUpdated}
        queryStrings={queryStrings}
        users={usersList}
        campusesPrincipals={campusPrincipalList}
        levelsPrincipals={levelPrincipalList}
        schoolAdmins={schoolAdminList}
      />}
    </div>
  )
}

export default AdminStaffConfig
