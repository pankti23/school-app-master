import React from 'react'
import './GradeSystemCampusAssigned.css'
import GradeSystemCampus from './GradeSystemCampus/GradeSystemCampus'
import PlusIcon from '../../../../../SchoolAPP Assets/plus.svg'

const GradeSystemCampusAssigned = () => {
  return (
    <div className="grade-system-campus-assigned">
      <p className="grade-system-campus-assigned-header">This grade system is used on the following Campusses:</p> 
      <div className="grade-system-assigned-campuses-container">
        <div className="grade-system-assigned-campuses">
          <GradeSystemCampus />
        </div>

        {/**
         * the code below is for when you edit
         */}
        {/* <div className="grade-system-campus-assigned-add-button">
          <img style={{ marginRight: "10px" }}src={PlusIcon} />
          <p>Add New</p>
        </div> */}
      </div>
    </div>
  )
}

export default GradeSystemCampusAssigned
