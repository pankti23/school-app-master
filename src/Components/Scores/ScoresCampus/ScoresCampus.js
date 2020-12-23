import React from "react";
import { FaCaretDown } from "react-icons/fa";

import Dropdown from "../../UI/Dropdown";
import LoadingSpinner from "../../UI/LoadingSpinner";
import MinimizeButton from "../../UI/MinimizeButton";
import ScoresGrade from "./ScoresGrade";
import {
  deleteScore,
  getScoresListByCampusByDate
} from "../../../services/scoreService";
import { useDict } from "../../UI/Translations";

import "./ScoresCampus.css";

const ScoresCampus = (props) => {
  const {
    campus,
    campusCalendarItems,
    campusGST,
    campusLevels,
    campusScores,
    grades,
    gradingSystem,
    groupSubjectTeachers,
    groups,
    loadScores,
    students
  } = props;

  const [dropdownItems, setDropdownItems] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  const [minimized, setMinimized] = React.useState(true);

  const [displayDatesDropdown, setDisplayDatesDropdown] = React.useState(false);

  const [latestDate, setLatestDate] = React.useState("");

  const [selectedDate, setSelectedDate] = React.useState({
    date: "",
    value: ""
  });

  const currentDate = new Date(Date.now()).toISOString().replace(/T.*/g, "");

  const dict = useDict("/scores-page");

  const handleDateClick = (date, latestDateData) => {
    // todo: fix selectedDate
    if (date !== selectedDate.date) {
      if (date === latestDateData && latestDateData > currentDate) {
        setSelectedDate({ date: date, value: "Current Scores" });
      } else {
        setSelectedDate({ date: date, value: date });
      }
    }
  };

  React.useEffect(() => {
    setLoading(true);

    loadScores(() => setLoading(false));
  }, [selectedDate]);

  React.useEffect(() => {
    const datesSet = new Set();

    campusScores.forEach((score) => datesSet.add(score.date));

    const futureCalendarItems = campusCalendarItems.filter(
      (date) => (date.endDate ?? date.startDate) > currentDate
    );

    const latestDateCalendar = futureCalendarItems[0]
      ? futureCalendarItems[0].endDate
        ? futureCalendarItems[0].endDate
        : futureCalendarItems[0].startDate ?? null
      : null;

    const latestDateScores = Array.from(datesSet).reverse()[0] ?? null;

    const latestDateData = latestDateCalendar ?? "-1" ?? "-1";

    const datesArray = Array.from(datesSet).filter(
      (date) => date <= currentDate
    );

    if (latestDateData === "-1" && latestDateData > currentDate) {
      setLatestDate(latestDateData);

      if (latestDateScores) {
        setSelectedDate({ date: latestDateScores, value: latestDateScores });
      } else {
        setSelectedDate({ date: "", value: "" });
      }
    } else if (latestDate === "") {
      setLatestDate(latestDateData);

      if (latestDateData > currentDate) {
        setSelectedDate({ date: latestDateData, value: "Current Scores" });
      } else if (datesArray && datesArray.length > 0) {
        setSelectedDate({
          date: datesArray[datesArray.length - 1],
          value: datesArray[datesArray.length - 1]
        });
      }
    }

    if (latestDateData > currentDate) {
      const scoresPromises = [];

      campusScores
        .filter(
          (score) => score.date > currentDate && score.date !== latestDateData
        )
        .forEach((score) => {
          scoresPromises.push(deleteScore({ id: score.id }));
        });

      if (scoresPromises.length > 0) {
        const deleteScores = async () => {
          setLoading(true);

          await Promise.all(scoresPromises);

          await loadScores(() => setLoading(false));
        };

        try {
          deleteScores();
        } catch (e) {
          console.log(dict("campus/message/error/api"), e);
        }
      }
    }

    if (latestDateData > currentDate) {
      datesArray.push(latestDateData);

      datesArray.reverse();

      setDropdownItems(() => {
        const items = [];

        items.push({
          onClick: () => handleDateClick(latestDateData, latestDateData),
          value: "Current Scores"
        });

        datesArray
          .filter((date) => date < latestDateData)
          .forEach((date) => {
            items.push({
              onClick: () => handleDateClick(date, latestDateData),
              value: date
            });
          });

        return items;
      });
    } else {
      datesArray.reverse();

      setDropdownItems(() => {
        const items = [];

        if (
          !datesArray.find((v) => v === latestDateData) &&
          latestDateData !== "-1"
        ) {
          datesArray.push(latestDateData);
        }

        datesArray.forEach((date) => {
          items.push({
            onClick: () => handleDateClick(date),
            value: date
          });
        });

        return items;
      });
    }

    const scoresPromises = [];

    if (latestDateData !== "-1") {
      datesArray.forEach((date) => {
        scoresPromises.push(
          getScoresListByCampusByDate({ date: date, campusId: campus.id })
        );
      });
    }

    if (scoresPromises.length > 0) {
      const addScores = async () => {
        setLoading(true);

        await Promise.all(scoresPromises);

        await loadScores(() => setLoading(false));
      };

      try {
        addScores();
      } catch (e) {
        console.log("Error loading data.", e);
      }
    }
  }, []);

  return (
    <div className="scores-campus-container">
      <div className="scores-campus-header-container">
        <div className="scores-campus-header-top-container">
          <div className="scores-campus-header-top-left-container">
            <span className="scores-campus-header-top-left-text">
              {campus.name}
            </span>
          </div>

          <div className="scores-campus-header-top-right-container">
            <MinimizeButton
              handleClick={() => setMinimized(!minimized)}
              minimized={minimized}
              style={{ bgcolor: "transparent" }}
            />
          </div>
        </div>

        {!minimized && <div className="scores-campus-header-divider" />}

        {!minimized && (
          <div className="scores-campus-header-bottom-container">
            <div className="scores-campus-header-bottom-left-container">
              <span className="scores-campus-header-bottom-left-text">
                {`${dict("campus/due-date")[0]} ${campus.name} ${
                  dict("campus/due-date")[1]
                } `}

                <span style={{ color: "#373737", fontWeight: "500" }}>
                  {latestDate > currentDate ? latestDate : "N/A"}
                </span>
              </span>
            </div>

            {dropdownItems.length > 0 && (
              <div className="scores-campus-header-bottom-right-container">
                <button
                  className="scores-campus-header-bottom-right-dropdown"
                  id={`scores-campus-header-bottom-right-dropdown-${campus.id}`}
                  onClick={() => setDisplayDatesDropdown(true)}
                >
                  <span className="scores-campus-header-bottom-right-dropdown-text">
                    {selectedDate ? selectedDate.value : ""}
                  </span>

                  <FaCaretDown size={14} />
                </button>

                {displayDatesDropdown && (
                  <Dropdown
                    closeDropdown={() => setDisplayDatesDropdown(false)}
                    dropdownItems={dropdownItems}
                    id={`scores-campus-header-bottom-right-dropdown-${campus.id}`}
                    style={{ fontSize: "12px", width: "200px" }}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {!minimized && (
        <span>
          {!loading ? (
            <div className="scores-campus-content-container">
              {campusLevels.map((level) => {
                return grades
                  .filter((grade) => grade.levelId === level.id)
                  .map((grade) => {
                    return (
                      <div
                        className="scores-campus-content-grade-container"
                        key={`${level.id}-${grade.id}`}
                      >
                        <ScoresGrade
                          current={selectedDate.date > currentDate}
                          gradeId={grade.id}
                          gradeGroups={groups.filter(
                            (group) => group.gradeId === grade.id
                          )}
                          gradeGST={campusGST.filter(
                            (gst) => gst.Group.gradeId === grade.id
                          )}
                          gradeName={grade.name}
                          gradeScores={campusScores
                            .filter((score) => score.date === selectedDate.date)
                            .filter((score) => score.Level.id === level.id)
                            .filter((score) => score.Grade.id === grade.id)}
                          gradingSystem={gradingSystem}
                          groupSubjectTeachers={groupSubjectTeachers}
                          levelName={level.name}
                          loadScores={async () => {
                            await loadScores();
                          }}
                          students={students}
                        />
                      </div>
                    );
                  });
              })}
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </span>
      )}
    </div>
  );
};

export default ScoresCampus;
