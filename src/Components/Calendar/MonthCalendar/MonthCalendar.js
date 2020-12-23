import React, {useState, useLayoutEffect} from "react";

import './MonthCalendar.css';

import {
  getDateString,
  getDatesForMonth,
  getNextMonth,
  getPriorMonth,
  dayNameChars,
  getCurrentMonth,
  getCurrentYear
} from "../../../utils";

import { useDict } from "../../UI/Translations"

// import dates from './dates';

import DayOfMonth from "./DayOfMonth";

const todayStr = getDateString(new Date());
/*
const month = todayStr.substring(5, 7);
const year = todayStr.substring(0, 4);
*/

const MonthCalendar = ({dates, handleDateClick, selectedDate}) => {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth(todayStr, dates));
  const [currentYear, setCurrentYear] = useState(getCurrentYear(todayStr, dates));
  const [monthName, setMonthName] = useState('');
  const [rows, setRows] = useState([]);

  const dict = useDict("/calendar")

  useLayoutEffect(() => {
    let rows = getDatesForMonth(dates, currentMonth, currentYear, todayStr, DayOfMonth, selectedDate, handleDateClick);
    setRows(rows);

    const lastRow = rows[rows.length - 1];
    const {fullMonth, year} = lastRow[lastRow.length - 1].props.date;
    setMonthName(fullMonth);
    setCurrentYear(year);

  }, [currentMonth, monthName, currentYear, selectedDate]);

  const handleNextMonth = () => {
    const { month: lastMonth, year: lastYear } = dates[dates.length - 1];
    const { month: firstMonth, year: firstYear } = dates[0];
    let nextMonth = getNextMonth(currentMonth);
    if (nextMonth < currentMonth) {
      console.log('Moving to next year');
      setCurrentYear(lastYear);
    } else if (nextMonth > currentMonth && nextMonth > lastMonth && currentYear === lastYear) {
      console.log('Rotating to first month');
      nextMonth = firstMonth;
      setCurrentYear(firstYear);
    }
    setCurrentMonth(nextMonth);
  };

  const handlePriorMonth = () => {
    const { month: firstMonth, year: firstYear } = dates[0];
    const { month: lastMonth, year: lastYear } = dates[dates.length - 1];
    let priorMonth = getPriorMonth(currentMonth);
    if (priorMonth > currentMonth) {
      console.log('Moving to previous year');
      setCurrentYear(firstYear);
    } else if (priorMonth < currentMonth && priorMonth < firstMonth && currentYear === firstYear) {
      console.log('Rotating to last month');
      priorMonth = lastMonth;
      setCurrentYear(lastYear);
    }
    setCurrentMonth(priorMonth);
  };

  return (
    <div className="calendar-month">
      <div className="calendar-month-header center-flex-items">
        <div className="month-name">{monthName} {currentYear}</div>
        <div className="month-buttons">
          <span className="month-nav-button" onClick={handlePriorMonth}>&lt;</span>
          <span className="month-nav-button" onClick={handleNextMonth}>&gt;</span>
        </div>
      </div>
      <div className="day-labels">
        {dict("calendar/value/day-names-chars", []).map((d, i) => (<span key={d+i} className="day-label">{d}</span>))}
      </div>
      <div className="month-body">
        {rows.map((d, i) => {
          return <div key={i} className="month-row">{d}</div>;
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
