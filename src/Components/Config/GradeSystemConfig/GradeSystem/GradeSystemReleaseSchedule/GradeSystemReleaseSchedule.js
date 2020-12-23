import React from 'react'
import './GradeSystemReleaseSchedule.css'
import ArrowDownIcon from '../../../../../SchoolAPP Assets/arrow-down.svg'

const GradeSystemReleaseSchedule = () => {
  return (
    <div className="grade-system-release-schedule">
      <p className="grade-system-release-schedule-header">Subject Score release schedule:</p> 
      <div className="grade-system-release-schedule-wrapper">
        <p className="grade-system-release-schedule-text">The subject scores will be released  at the end of every</p> 
        <div className="grade-system-release-schedule-drop-down">
          <p>Month</p>
          <img 
            src={ArrowDownIcon} 
            className="grade-system-release-schedule-drop-down-arrow"
          />
        </div>
      </div>
    </div>
  )
}

export default GradeSystemReleaseSchedule
