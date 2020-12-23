import React from "react";

export default ({time}) => (
  <div className="week-sidebar">
    <span className="time-of-day">{time.allDay ? 'All Day' : time.startTime}</span>
  </div>
);
