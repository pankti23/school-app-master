import React, {useEffect, useState} from "react";

const DayOfMonth = ({ date, isToday, selectedDate, handleDateClick }) => {
  const [dateClass, setDateClass] = useState('');

  useEffect(() => {
    let dateClass = 'month-date';
    if (!isToday) {
      if (date && date.date === selectedDate) {
        dateClass += ' selected-date';
      }
    }
    dateClass += isToday ? ' today' : '';
    setDateClass(dateClass);
  }, [date, isToday, selectedDate]);

  if (date) {
    return <div className={dateClass} onClick={() => handleDateClick(date.date)}>{parseInt(date.day,10)}</div>
  }
  return  <div className={dateClass}>{''}</div>;
};

export default DayOfMonth;
