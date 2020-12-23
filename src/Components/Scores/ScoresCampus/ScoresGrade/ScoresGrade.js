import React from "react";

import MinimizeButton from "../../../UI/MinimizeButton";
import ScoresGroup from "./ScoresGroup";

import "./ScoresGrade.css";

const ScoresGrade = (props) => {
  const {
    current,
    gradeId,
    gradeGroups,
    gradeGST,
    gradeName,
    gradeScores,
    gradingSystem,
    groupSubjectTeachers,
    levelName,
    loadScores,
    students
  } = props;

  const [minimized, setMinimized] = React.useState(true);

  React.useEffect(() => {
    setMinimized(
      students.filter((student) =>
        student.Grade ? student.Grade.id === gradeId : null
      ).length === 0
    );
  }, []);

  return (
    <div className="scores-grade-container">
      <div className="scores-grade-header-container">
        <div className="scores-grade-header-left-container">
          <span className="scores-grade-header-left-text">
            {`${levelName} - ${gradeName}`}
          </span>
        </div>

        <div className="scores-grade-header-right-container">
          <MinimizeButton
            handleClick={() => setMinimized(!minimized)}
            minimized={minimized}
          />
        </div>
      </div>

      {!minimized && (
        <div className="scores-grade-content-container">
          {gradeGroups.map((group, i) => (
            <div
              className="scores-grade-content-group-container"
              key={group.id}
            >
              <ScoresGroup
                current={current}
                gradingSystem={gradingSystem}
                groupName={group.name}
                groupGST={groupSubjectTeachers.filter(
                  (subject) => subject.groupId === group.id
                )}
                groupScores={gradeScores.filter(
                  (score) => score.Group.id === group.id
                )}
                groupStudents={students.filter((student) =>
                  student.Group ? student.Group.id === group.id : false
                )}
                groupSubjects={gradeGST
                  .filter((gst) => gst.groupId === group.id)
                  .map((gst) => gst.Subject)}
                loadScores={loadScores}
              />

              {i < gradeGroups.length - 1 && (
                <div className="scores-grade-content-group-divider" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoresGrade;
