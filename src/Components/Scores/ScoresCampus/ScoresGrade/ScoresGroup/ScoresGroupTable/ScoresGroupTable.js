import React from "react";
import { FaCaretDown } from "react-icons/fa";

import Button from "../../../../../UI/Button";
import SearchIcon from "../../../../../../SchoolAPP Assets/search.svg";
import { Search } from "../../../../../UI/Search/Search";
import { updateScore } from "../../../../../../services/scoreService";
import { useDict } from "../../../../../UI/Translations";

import "./ScoresGroupTable.css";

const ScoresGroupTable = (props) => {
  const {
    current,
    gradingSystem,
    loadScores,
    scores,
    students,
    subjects
  } = props;

  const [disabled, setDisabled] = React.useState(false);

  const [message, setMessage] = React.useState({
    message: "",
    type: "none"
  });

  const [saved, setSaved] = React.useState(
    students.map((student) => [student.id, 0])
  );

  const [scoresMap, setScoresMap] = React.useState();

  const dict = useDict("/scores-page");

  const search = Search(students);

  const handleSaveAllButtonClick = async () => {
    if (!current) {
      setMessage({
        message: dict("group-table/message/error/locked"),
        type: "error"
      });
    } else if (!disabled) {
      setDisabled(true);

      const promises = [].concat(
        ...students.map((student) => {
          return scores
            .filter((score) => score.Student.id === student.id)
            .map((score) => {
              return updateScore({
                id: score.id,
                score: getScore(score.Student.id, score.Subject.id)
              });
            });
        })
      );

      try {
        await Promise.all(promises);

        await loadScores();

        setMessage({
          message: dict("group-table/message/success"),
          type: "success"
        });
      } catch (e) {
        console.log(e);

        setMessage({
          message: `${dict("group-table/message/error/api")} ${e.status}.`,
          type: "error"
        });
      }

      setDisabled(false);
    }
  };

  const handleSaveButtonClick = async (studentId) => {
    if (!current) {
      handleSaved(studentId, -1);
    } else if (!disabled && getSaved(studentId) === 0) {
      setDisabled(true);

      await scores
        .filter((score) => score.Student.id === studentId)
        .forEach(async (score) => {
          try {
            await updateScore({
              id: score.id,
              score: getScore(score.Student.id, score.Subject.id)
            });

            await loadScores();
          } catch (e) {
            console.log(e);

            handleSaved(studentId, -1);
          }
        });

      setDisabled(false);

      handleSaved(studentId, 1);
    }
  };

  const handleSaved = (studentId, value) => {
    const savedTemp = saved.map((v) => v);

    savedTemp.find((v) => v[0] === studentId)[1] = value;

    setSaved(savedTemp);
  };

  const handleScoreChange = (e, studentId, subjectId) => {
    if (current) {
      setScore(e.target.value, studentId, subjectId);

      handleSaved(studentId, 0);
    }
  };

  const getSaved = (studentId) => {
    return saved.find((v) => v[0] === studentId)[1];
  };

  const getScore = (studentId, subjectId) => {
    return scoresMap
      ? scoresMap[studentId][subjectId] === ""
        ? gradingSystem[0]
        : scoresMap[studentId][subjectId]
      : "";
  };

  const setScore = (score, studentId, subjectId) => {
    const scoresMapTemp = JSON.parse(JSON.stringify(scoresMap));

    scoresMapTemp[studentId][subjectId] = score;

    setScoresMap(scoresMapTemp);
  };

  React.useEffect(() => {
    if (message.type === "message" || message.type === "success") {
      setTimeout(() => setMessage({ message: "", type: "none" }), 3000);
    }
  }, [message]);

  React.useEffect(() => {
    search.search();
  }, [search]);

  React.useEffect(() => {
    search.setDisplayedContents(students);
  }, [students]);

  React.useState(() => {
    const scoresMapTemp = {};

    students.forEach((student) => {
      scoresMapTemp[student.id] = {};

      subjects.forEach((subject) => {
        if (
          scores.filter((score) => score.Subject.name === subject.name).length >
          0
        ) {
          const studentSubjectScores = scores
            .filter((score) => score.Student.name === student.name)
            .find((score) => score.Subject.name === subject.name);

          scoresMapTemp[student.id][subject.id] = studentSubjectScores
            ? studentSubjectScores.score ?? ""
            : "";
        } else {
          scoresMapTemp[student.id][subject.id] = gradingSystem[0];
        }
      });
    });

    setScoresMap(scoresMapTemp);
  }, []);

  return (
    <div className="scores-group-table-wrapper">
      <div className="scores-group-table-container">
        <table className="scores-group-table">
          <thead className="scores-group-table-head">
            <tr className="scores-group-table-head-top">
              <th className="scores-group-table-head-top-search">
                <div className="scores-group-table-head-top-search-container">
                  <img
                    alt="search-icon"
                    className="scores-group-table-head-top-search-icon"
                    src={SearchIcon}
                  />

                  <input
                    className="scores-group-table-head-top-search-input"
                    onChange={search.handleSearchChange}
                    onKeyDown={search.handleKeyDown}
                    placeholder={dict("group-table/search-placeholder")}
                    type="text"
                  />
                </div>
              </th>
            </tr>

            <tr className="scores-group-table-head-bottom">
              <th className="scores-group-table-head-bottom-cell">
                <span className="scores-group-table-head-bottom-cell-text">
                  {dict("group-table/student-name")}
                </span>
              </th>

              {subjects.map((subject) => (
                <th
                  className="scores-group-table-head-bottom-cell"
                  key={subject.id}
                >
                  <span className="scores-group-table-head-bottom-cell-text">
                    {subject.name.toUpperCase()}
                  </span>
                </th>
              ))}

              <th className="scores-group-table-head-bottom-cell" />

              <th
                className="scores-group-table-head-bottom-cell"
                style={{ borderLeft: current ? "1px solid #dbdbdb" : "0" }}
              >
                {current && (
                  <span className="scores-group-table-head-bottom-cell-text">
                    {dict("group-table/save-button").toUpperCase()}
                  </span>
                )}
              </th>
            </tr>
          </thead>

          <tbody className="scores-group-table-body">
            {search.displayedContents.map((student) => (
              <tr className="scores-group-table-body-row" key={student.id}>
                <td className="scores-group-table-body-row-student-cell">
                  <span className="scores-group-table-body-row-student-cell-text">
                    {student.name}
                  </span>
                </td>

                {subjects.map((subject) => (
                  <td
                    className="scores-group-table-body-row-cell"
                    key={subject.id}
                  >
                    <div style={{ position: "relative" }}>
                      <select
                        className="scores-group-table-body-row-dropdown"
                        disabled={!current ? 1 : null}
                        onChange={(e) =>
                          handleScoreChange(e, student.id, subject.id)
                        }
                        tabIndex="0"
                        value={getScore(student.id, subject.id)}
                      >
                        {gradingSystem.map((v, i) => (
                          <option
                            className="scores-group-table-body-row-dropdown-item"
                            key={i}
                            value={v}
                          >
                            {v}
                          </option>
                        ))}
                      </select>

                      <button
                        className="scores-group-table-body-row-dropdown-button"
                        id={`scores-group-table-body-row-dropdown-button-${subject.id}-${student.id}`}
                        style={{
                          backgroundColor: !current ? "#f4f4f4" : "#ffffff"
                        }}
                        tabIndex="-1"
                      >
                        <div className="scores-group-table-body-row-dropdown-button-text">
                          {getScore(student.id, subject.id)}
                        </div>

                        <FaCaretDown />
                      </button>
                    </div>
                  </td>
                ))}

                <td className="scores-group-table-body-row-cell" />

                <td
                  className="scores-group-table-body-row-cell"
                  style={{ borderLeft: current ? "1px solid #dbdbdb" : "0" }}
                >
                  {current && (
                    <button
                      className="scores-group-table-body-row-save-button"
                      onClick={() => handleSaveButtonClick(student.id)}
                    >
                      <span
                        className="scores-group-table-body-row-save-text"
                        style={{
                          color:
                            getSaved(student.id) === 0
                              ? "#000000"
                              : getSaved(student.id) === 1
                              ? "#00dd00"
                              : "#ff0000"
                        }}
                      >
                        {getSaved(student.id) === 0
                          ? "Save"
                          : getSaved(student.id) === 1
                          ? "Saved!"
                          : "Error!"}
                      </span>
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {current && (
              <tr className="scores-group-table-body-save-row">
                <td
                  className="scores-group-table-body-save-cell"
                  colSpan={3 + subjects.length}
                >
                  <div className="scores-group-table-body-save-message-container">
                    <span
                      className="scores-group-table-body-save-message-text"
                      style={{
                        color:
                          message.type === "error"
                            ? "#ff0000"
                            : message.type === "success"
                            ? "#00dd00"
                            : "#000000"
                      }}
                    >
                      {message.message}
                    </span>
                  </div>

                  <div className="scores-group-table-body-save-button-container">
                    <Button
                      color="grey"
                      onClick={handleSaveAllButtonClick}
                      size="medium"
                      width="100%"
                    >
                      <span className="scores-group-table-body-save-text">
                        {dict("group-table/save-all-button")}
                      </span>
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoresGroupTable;
