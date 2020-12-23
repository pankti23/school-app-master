import React from "react";

import MinimizeButton from "../../../../UI/MinimizeButton";
import ScoresGroupTable from "./ScoresGroupTable";

import "./ScoresGroup.css";

const ScoresGroup = (props) => {
  const {
    current,
    gradingSystem,
    groupGST,
    groupName,
    groupScores,
    groupSubjects,
    groupStudents,
    loadScores
  } = props;

  const [minimized, setMinimized] = React.useState(true);

  const subjectsArray = [];

  const subjectsSet = new Set();

  groupScores.forEach((score) => subjectsSet.add(score.Subject.name));

  groupGST.forEach((subject) => subjectsSet.add(subject.Subject.name));

  Array.from(subjectsSet).forEach((subjectName) =>
    subjectsArray.push(
      groupSubjects.find((subject) => subject.name === subjectName)
    )
  );

  React.useEffect(() => {
    setMinimized(groupStudents.length === 0);
  }, [groupScores]);

  return (
    gradingSystem && (
      <div className="scores-group-container">
        <div className="scores-group-header-container">
          <div className="scores-group-header-left-container">
            <span className="scores-group-header-left-text">
              <span style={{ color: "#000000" }}>{groupName}</span>
            </span>
          </div>

          <div className="scores-group-header-right-container">
            <MinimizeButton
              handleClick={() => setMinimized(!minimized)}
              minimized={minimized}
            />
          </div>
        </div>

        <div className="scores-group-content-container">
          {!minimized && (
            <div className="scores-group-content-table-container">
              <ScoresGroupTable
                current={current}
                gradingSystem={gradingSystem}
                loadScores={loadScores}
                scores={groupScores}
                students={groupStudents}
                subjects={subjectsArray.filter((subject) => subject)}
              />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ScoresGroup;
