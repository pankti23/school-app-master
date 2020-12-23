import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";

import './TeachersConfig.css';

// components
import TeachersConfigHeader from './TeachersConfigHeader/TeachersConfigHeader';
import Campus from './Campus/Campus';
import LoadingSpinner from "../../UI/LoadingSpinner";
import queryString from 'query-string';

import WarningIfAlreadyAdded from './WarningIfAlreadyAdded/WarningIfAlreadyAdded';
import WarningIfSTNotInCampus from './WarningIfSTNotInCampus/WarningIfSTNotInCampus';

import { setCurrentPage } from "../../../services/localStorageService";
import { getSubjectList } from "../../../services/subjectService";
import { getUsersList } from "../../../services/userService";
import { getGroupSubjectTeachersList } from "../../../services/groupSubjectTeachersService";
import { getCampusList } from "../../../services/campusService";
import { getDivisionsTree } from '../../../services/schoolInfoService';
import { getLevelList } from "../../../services/levelService";
import { getGradeList } from "../../../services/gradeService";
import { getGroupList } from "../../../services/groupService";
import { getAfterSchoolGroupList } from "../../../services/afterSchoolGroupService";
import { getAfterSchoolGroupTeachersList } from "../../../services/afterSchoolGroupTeachersService";
import { getMainTeachersList, getSubjectTeachersList } from "../../../services/teacherService";

// context
import { UserContext } from '../../../Contexts/UserContext';
import useFetch from '../../../CustomHooks/useFetch';

const baseUrl = process.env.REACT_APP_BASE_URL;

const TeachersConfig = ({ location }) => {
  const queryStrings = queryString.parse(location.search);

  const [subjectList, setSubjectsList] = useState([]);
  const [campusList, setCampusList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [afterSchoolGroupsList, setAfterSchoolGroupsList] = useState([]);
  const [afterSchoolGroupTeachersList, setAfterSchoolGroupTeachersList] = useState([]);

  const [mainTeachers, setMainTeachersList] = useState([]);
  const [subjectTeachers, setSubjectTeachersList] = useState([]);
  const [groupSubjectTeachers, setGroupSubjectTeachersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [divisionsTreeList, setDivisionsTreeList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  const [error, setError] = useState(false);

  const [isWarning, setWarning] = useState(false);
  const [isWarningForSTNotInCampus, setWarningForSTNotInCampus] = useState(false);

  const [isMainTeacherExistInGroup, setMainTeacherExistInGroup] = useState({});

  const [isShowWarningForST, setWarningForSTModalShowStatus] = useState(false);

  setCurrentPage(`/configuration-page/teachers${location.search}`);

  const userData = useContext(UserContext);

  const getDataFromServer = async () => {

    const promises = [
      getCampusList(),
      getLevelList(),
      getGradeList(),
      getGroupList(),
      getSubjectList(),
      getAfterSchoolGroupList(),
      getAfterSchoolGroupTeachersList(),
      getMainTeachersList(),
      getSubjectTeachersList(),
      getGroupSubjectTeachersList(),
      getUsersList(),
      getDivisionsTree(),
    ];

    return Promise.all(promises);
  };

  const loadData = () => {
    const getData = async () => {
      const [
        campuses,
        levels,
        grades,
        groups,
        subjects,
        afterSchoolGroups,
        afterSchoolGroupTeachers,
        mainTeachers,
        subjectTeachers,
        groupSubjectTeachers,
        users,
        divisionsTree
      ] = await getDataFromServer();

      setCampusList(campuses);
      setLevelsList(levels);
      setGradesList(grades);
      setGroupsList(groups);

      setSubjectsList(subjects);

      setAfterSchoolGroupsList(afterSchoolGroups);
      setAfterSchoolGroupTeachersList(afterSchoolGroupTeachers);

      setMainTeachersList(mainTeachers);
      setSubjectTeachersList(subjectTeachers);
      setGroupSubjectTeachersList(groupSubjectTeachers);

      setUsersList(users);
      setDivisionsTreeList(divisionsTree);

      setIsLoading(false);
    };

    try {
      getData();
      if (updated) {
        console.log('update')
        setUpdated(false);
      }
    } catch (e) {
      console.log("TeachersConfig Component Error:", e);
      setIsLoading(false);
      setError(true);
    }
  };

  let combinedMainAndSubjectTeachers = [...mainTeachers, ...subjectTeachers]; 

  useEffect(() => {
    loadData();
  }, [updated]);

  useEffect(() => {
    if (isWarningForSTNotInCampus) {
      setWarningForSTModalShowStatus(true);
    }
  }, [isWarningForSTNotInCampus]);

  useEffect(() => {
  }, [isMainTeacherExistInGroup]);

  return (
    <div className="teachers-config-container">
      <TeachersConfigHeader />
      <WarningIfSTNotInCampus isModalOpen={isShowWarningForST} closeModal={() => {
        setWarningForSTModalShowStatus(false);
        setWarningForSTNotInCampus(false);
      }} />
      <div className="grade-system-config-body">
        {isLoading ? <LoadingSpinner /> : (
          campusList.map((campus) => {
            return (
              <Campus
                campus={campus}
                queryStrings={queryStrings}
                levels={levelsList}
                grades={gradesList}
                groups={groupsList}
                updated={updated}
                setUpdated={setUpdated}
                subjects={subjectList}
                afterSchoolGroups={afterSchoolGroupsList}
                afterSchoolGroupTeachers={afterSchoolGroupTeachersList}
                mainTeachers={mainTeachers}
                combinedMainAndSubjectTeachers={combinedMainAndSubjectTeachers}
                subjectTeachers={subjectTeachers}
                groupSubjectTeachers={groupSubjectTeachers}
                divisionsTree={divisionsTreeList}
                key={campus.id}
                jwt={userData.jwt}
                users={usersList}
                setWarning={setWarning}
                setWarningForSTNotInCampus={setWarningForSTNotInCampus}
                setMainTeacherExistInGroup={setMainTeacherExistInGroup}
                isMainTeacherExistInGroup={isMainTeacherExistInGroup}
              />
            )
          })
        )}
      </div>
    </div>
  );
}

export default TeachersConfig;
