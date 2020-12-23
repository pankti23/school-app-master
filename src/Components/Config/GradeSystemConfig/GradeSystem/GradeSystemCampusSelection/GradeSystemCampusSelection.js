import React from 'react'
import './GradeSystemCampusSelection.css'
import GreenCheckIcon from '../../../../../SchoolAPP Assets/check-green.svg'
import UncheckIcon from '../../../../../SchoolAPP Assets/unchecked.svg'

const GradeSystemCampusSelection = () => {
  return (
    <div className="grade-system-campus-selection">
      <img src={GreenCheckIcon}/>
      <p className="grade-system-campus-selection-text">Tech Campus</p>
    </div>
  )
}

export default GradeSystemCampusSelection
