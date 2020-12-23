import React from 'react'
import './GradeSystemOpenButton.css'
import PlusSign from "../../../../../SchoolAPP Assets/BlackPlus"

const GradeSystemOpenButton = (props) => {
  const { toggleMinimizedState } = props
  return (
    <div 
      role="button"
      tabIndex={0}
      className="grade-system-open-button"
      onClick={toggleMinimizedState}
    >
      <PlusSign fill="#000000" width="15px" height="15px" stroke="none" style={{}} />
      <p className="grade-system-open-button-text">Open</p>
    </div>
  )
}

export default GradeSystemOpenButton
