import React from "react";

import LoadingSpinner from "../../UI/LoadingSpinner";
import SubjectConfigHeader from "./SubjectConfigHeader/SubjectConfigHeader";
import SubjectManager from "./SubjectManager/SubjectManager";
import { getSubjectList } from "../../../services/subjectService";
import { getSubjectTeachersList } from "../../../services/subjectTeachersService";
import { setCurrentPage } from "../../../services/localStorageService";
import { useDict } from "../../UI/Translations";

import "./SubjectsConfig.css";

const SubjectsConfig = () => {
  const [loading, setLoading] = React.useState(true);

  const [subjectTeachers, setSubjectTeachers] = React.useState([]);

  const [subjects, setSubjects] = React.useState([]);

  const dict = useDict("/configuration-page/subjects");

  setCurrentPage("/configuration-page/subjects");

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const getData = async () => {
      const getDataFromServer = async () => {
        const promises = [getSubjectList(), getSubjectTeachersList()];

        return Promise.all(promises);
      };

      const [subjects, subjectTeachers] = await getDataFromServer();

      setSubjectTeachers(subjectTeachers);

      setSubjects(subjects);

      setLoading(false);
    };

    try {
      getData();
    } catch (e) {
      console.log(dict("main/message/error/api"));

      setLoading(false);
    }
  };

  return (
    <div>
      <div className="subject-config-container">
        <SubjectConfigHeader />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="subject-config-body">
            <SubjectManager
              setSubjects={setSubjects}
              subjectTeachers={subjectTeachers}
              subjects={subjects}
              loadData={loadData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsConfig;
