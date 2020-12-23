import React from "react";

import ExtracurricularCampus from "./ExtracurricularCampus/ExtracurricularCampus";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { getAfterSchoolGroupList } from "../../../services/afterSchoolGroupService";
import { getCampusList } from "../../../services/campusService";
import { setCurrentPage } from "../../../services/localStorageService";
import { useDict } from "../../UI/Translations"

import "./ExtracurricularConfig.css";

const ExtracurricularConfig = () => {
  const [extracurricularGroups, setExtracurricularGroups] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const dict = useDict("/configuration-page/extracurricular")

  const loadData = () => {
    const getData = async () => {
      const campusesData = await getCampusList();

      const groupsData = await getAfterSchoolGroupList();

      campusesData.forEach((v, i) => {
        campusesData[i].extracurricularGroup = [];
      });

      groupsData.forEach((group, i) => {
        const index = campusesData.findIndex(
          campus => campus.id === group.campusId
        );

        campusesData[index].extracurricularGroup.push(group);
      });

      setExtracurricularGroups(campusesData);

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
    setCurrentPage("/configuration-page/extracurricular");

    loadData();
  }, []);

  return (
    <div className="extracurricular-config-container">
      <div className="extracurricular-config-header-container">
        <p className="extracurricular-config-header-title-text">
          {dict("main/header/title")}
        </p>

        <p className="extracurricular-config-header-paragraph-text">
          {dict("main/header/paragraph")}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="extracurricular-config-content-wrapper">
          {extracurricularGroups.map(v => (
            <div
              className="extracurricular-config-content-container"
              key={v.id}
            >
              <ExtracurricularCampus campus={v} loadData={loadData} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExtracurricularConfig;
