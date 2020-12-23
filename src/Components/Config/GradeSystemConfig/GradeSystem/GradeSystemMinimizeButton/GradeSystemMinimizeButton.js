import React from 'react'
import './GradeSystemMinimizeButton.css'
import MinimizeIcon from '../../../../../SchoolAPP Assets/Minimize.svg'

const GradeSystemMinimizeButton = (props) => {
  const { toggleMinimizedState } = props
  return (
    <div 
      role="button"
      tabIndex={0}
      className="grade-system-minimize-button"
      onClick={toggleMinimizedState}
    >
      <img src={MinimizeIcon} />
      <p className="grade-system-minimize-button-text">Minimize</p>
    </div>
  )
}

export default GradeSystemMinimizeButton
