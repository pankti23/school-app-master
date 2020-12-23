import React from "react";

import LoadingSpinner from "../UI/LoadingSpinner";
import ScoresCampus from "./ScoresCampus";
import { getCampusList } from "../../services/campusService";
import { getGradeList } from "../../services/gradeService";
import { getGradingSystems } from "../../services/gradingSystemsService";
import { getGroupList } from "../../services/groupService";
import { getGroupSubjectTeachersList } from "../../services/groupSubjectTeacherService";
import { getItemByType } from "../../services/calendarService";
import { getLevelList } from "../../services/levelService";
import { getScoresList } from "../../services/scoreService";
import { getStudentList } from "../../services/studentService";
import { setCurrentPage } from "../../services/localStorageService";
import { useDict } from "../UI/Translations";

import "./Scores.css";

const Scores = () => {
  const [calendarItems, setCalendarItems] = React.useState([]);

  const [campuses, setCampuses] = React.useState([]);

  const [grades, setGrades] = React.useState([]);

  const [gradingSystems, setGradingSystems] = React.useState([]);

  const [groupSubjectTeachers, setGroupSubjectTeachers] = React.useState([]);

  const [groups, setGroups] = React.useState([]);

  const [levels, setLevels] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const [scores, setScores] = React.useState([]);

  const [students, setStudents] = React.useState([]);

  const dict = useDict("/scores-page");

  const loadData = () => {
    const getData = async () => {
      const [
        calendarItemsData,
        campusesData,
        gradesData,
        gradingSystemsData,
        groupSubjectTeachersData,
        groupsData,
        levelsData,
        scoresData,
        studentsData
      ] = await Promise.all([
        getItemByType("7"),
        getCampusList(),
        getGradeList(),
        getGradingSystems(),
        getGroupSubjectTeachersList(),
        getGroupList(),
        getLevelList(),
        getScoresList(),
        getStudentList()
      ]);

      setCalendarItems(calendarItemsData);

      setCampuses(campusesData);

      setGrades(gradesData);

      setGradingSystems(gradingSystemsData);

      setGroupSubjectTeachers(groupSubjectTeachersData);

      setGroups(groupsData);

      setLevels(levelsData);

      setScores(scoresData);

      setStudents(studentsData);

      setLoading(false);
    };

    try {
      getData();
    } catch (e) {
      console.log(dict("main/message/error/api"), e);
    }
  };

  const loadScores = async (handleLoading) => {
    try {
      const scoresData = await getScoresList();

      setScores(scoresData);

      if (handleLoading) handleLoading();
    } catch (e) {
      console.log(dict("main/message/error/api"), e);
    }
  };

  React.useEffect(() => {
    setCurrentPage("/scores-page");

    loadData();
  }, []);

  return (
    <div className="scores-container">
      <div className="scores-header-container">
        <div className="scores-header-top-container">
          <div className="scores-header-top-left-container">
            <div className="scores-header-top-left-title-container">
              <span className="scores-header-top-left-title-text">
                {dict("main/header-title")}
              </span>
            </div>

            <div className="scores-header-top-left-paragraph-container">
              <span className="scores-header-top-left-paragraph-text">
                {dict("main/header-paragraph")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!loading ? (
        <div className="scores-content-container">
          {campuses.map((campus) => {
            return (
              <div className="scores-content-campus-container" key={campus.id}>
                <ScoresCampus
                  campus={campus}
                  campusCalendarItems={calendarItems.filter((item) =>
                    item.visibleTo?.campuses?.includes(campus.id)
                  )}
                  campusGST={groupSubjectTeachers.filter(
                    (gst) => gst.Group.Grade.Level.campusId === campus.id
                  )}
                  campusLevels={levels.filter(
                    (level) => level.campusId === campus.id
                  )}
                  campusScores={scores.filter(
                    (student) => student.Campus.id === campus.id
                  )}
                  grades={grades}
                  gradingSystem={
                    gradingSystems.find(
                      (system) => system.campusId === campus.id
                    )
                      ? gradingSystems
                          .find((system) => system.campusId === campus.id)
                          .Grades.map((grade) => grade.grade)
                      : null
                  }
                  groupSubjectTeachers={groupSubjectTeachers}
                  groups={groups}
                  loadScores={loadScores}
                  loading={loading}
                  students={students}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Scores;
