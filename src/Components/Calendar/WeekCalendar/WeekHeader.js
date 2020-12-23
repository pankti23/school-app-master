import React from "react";

import { useDict } from "../../UI/Translations"

export default ({dates}) => {
  const dict = useDict("/calendar")

  const dayNamesFull = dict("calendar/value/day-names-full", [])

  return (<React.Fragment>
    <div className="week-labels-row">
      <div className="week-sidebar">
      </div>
      {dayNamesFull.map((d, i) => (<span key={d + i} className="week-cell week-day-name">{d}</span>))}
    </div>
    <div className="week-labels-row">
      <div className="week-sidebar">
      </div>
      {dates.map((d, i) => (<span key={d + i} className="week-cell week-day">{d}</span>))}
    </div>
  </React.Fragment>
  )
}
