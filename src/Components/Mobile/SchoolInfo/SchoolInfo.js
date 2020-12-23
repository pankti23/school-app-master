import React from "react";

import LoadingSpinner from "../../UI/LoadingSpinner";
import SchoolInfoCampus from "./SchoolInfoCampus";
import SchoolInfoSchool from "./SchoolInfoSchool";
import { getCampusList } from "../../../services/campusService";
import { getLevelList } from "../../../services/levelService";
import { getSchoolInfo } from "../../../services/schoolInfoService";
import { setCurrentPage } from "../../../services/localStorageService";
import { useDict } from "../../UI/Translations";

import "./SchoolInfo.css";

const SchoolInfo = () => {
  const [campuses, setCampuses] = React.useState([]);

  const [disabled, setDisabled] = React.useState(false);

  const [loading, setLoading] = React.useState(true);

  const [schoolInfo, setSchoolInfo] = React.useState([]);

  const dict = useDict("/mobile/school-info");

  const getCampusNames = async () => {
    const campusesData = await getCampusList();

    return campusesData.map((v) => v.name.toLowerCase());
  };

  const loadData = () => {
    const getData = async () => {
      setDisabled(true);

      const campusesData = await getCampusList();

      const levelData = await getLevelList();

      const schoolInfoData = await getSchoolInfo();

      campusesData.forEach((campus, i) => {
        campusesData[i].levels = [];
      });

      levelData.forEach((level) => {
        const index = campusesData.findIndex(
          (campus) => campus.id === level.campusId
        );

        campusesData[index].levels.push(level);
      });

      setCampuses(campusesData);

      setSchoolInfo(schoolInfoData);

      setDisabled(false);

      setLoading(false);
    };

    try {
      getData();
    } catch (e) {
      console.log(dict("main/message/error/api"));

      setLoading(false);
    }
  };

  React.useEffect(() => {
    setCurrentPage("/mobile/school-info");

    loadData();
  }, []);

  return (
    <div className="school-info-container">
      <div className="school-info-header-container">
        <p className="school-info-header-title-text">
          {dict("main/header-title")}
        </p>

        <p className="school-info-header-paragraph-text">
          {dict("main/header-paragraph")}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="school-info-content-wrapper">
          <div className="school-info-content-container">
            <SchoolInfoSchool
              disabled={disabled}
              handleDisabled={() => setDisabled(true)}
              loadData={loadData}
              schoolInfo={schoolInfo}
            />
          </div>

          {campuses.map((v) => (
            <div className="school-info-content-container" key={v.id}>
              <SchoolInfoCampus
                campus={v}
                disabled={disabled}
                getCampusNames={getCampusNames}
                handleDisabled={(state) => setDisabled(state)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolInfo;
