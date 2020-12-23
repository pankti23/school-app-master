import React, { useState, useEffect } from "react";
import "./GradeSystemConfig.css";
import GradeConfigHeader from "./GradeConfigHeader/GradeConfigHeader";
import GradeSystem from "./GradeSystem/GradeSystem";
import LoadingSpinner from "../../UI/LoadingSpinner";
import AddGradeSystemToCampus from "./AddGradeSystemToCampus/AddGradeSystemToCampus";

import { getCampusList } from "../../../services/campusService";

import {
  getGradingSystems,
  getStandardGradingSystems
} from "../../../services/gradingSystemsService";

import { setCurrentPage } from "../../../services/localStorageService";

const getDataFromServer = async () => {
  const promises = [
    getGradingSystems(),
    getStandardGradingSystems(),
    getCampusList()
  ];
  return Promise.all(promises);
};

const GradeSystemConfig = () => {
  const [loading, setLoading] = useState(true);
  const [loadDataSuccess, setLoadinDataSucess] = useState();
  const [error, setError] = useState(false);

  const [gradingSystems, setGradingSystems] = useState([]); // all the grading systems for all campuses
  const [standardGradingSystems, setStandardGradingSystems] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [
    campusWithOutGradingSystems,
    setCampusWithOutGradingSystems
  ] = useState([]);

  setCurrentPage("/configuration-page/grade-system");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const getData = async () => {
      const [
        gradingSystems,
        standardGradingSystems,
        campuses
      ] = await getDataFromServer();

      const campusWithGradingSystemIds = gradingSystems.map(
        gradingSystem => gradingSystem.campusId
      );
      const campusWithOutGradingSystems = campuses.filter(campus => {
        return !campusWithGradingSystemIds.includes(campus.id);
      });

      setGradingSystems(gradingSystems); // these are the grading systems for each campus
      setStandardGradingSystems(standardGradingSystems);
      setCampuses(campuses);
      setCampusWithOutGradingSystems(campusWithOutGradingSystems);

      setLoading(false);
    };

    try {
      getData();
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(true); // show error page
    }
  };

  const displayGradeSystems = gradingSystems.map(gradeSystem => {
    return (
      <GradeSystem
        key={gradeSystem.id}
        gradeSystem={gradeSystem}
        loadData={loadData}
      />
    );
  });

  const displayCampusesWithoutGradeSystems = campusWithOutGradingSystems.map(
    (campus, index) => {
      return (
        <AddGradeSystemToCampus
          key={campus.id}
          campus={campus}
          loadData={loadData}
        />
      );
    }
  );

  console.log(campuses);

  return (
    <div className="grade-system-config-container">
      <GradeConfigHeader />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grade-system-config-body">
          {displayGradeSystems}
          {displayCampusesWithoutGradeSystems}
        </div>
      )}
    </div>
  );
};

export default GradeSystemConfig;
