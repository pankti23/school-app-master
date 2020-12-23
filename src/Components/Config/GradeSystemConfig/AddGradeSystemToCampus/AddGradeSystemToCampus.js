import React from 'react'
import './AddGradeSystemToCampus.css'
import AddGradeSystemButton from './AddGradeSystemButton/AddGradeSystemButton'

const AddGradeSystemToCampus = (props) => {
  const { displayGradeSystemModel, campus, loadData } = props
  const { name, id : campusId } = campus // renamed the campus.id to campusId

  return (
  <div className="add-grade-system-to-campus-container">
    <div className="add-grade-system-to-campus-header-text">
      <span 
        className="add-grade-system-to-campus-header-title" 
        style={{marginRight: "10px"}}
      >
        {name}
      </span>
     
    </div>
    <AddGradeSystemButton 
      displayGradeSystemModel={displayGradeSystemModel}
      campusId={campusId} 
      loadData={loadData}
    />
  </div> 
  )
}

export default AddGradeSystemToCampus
