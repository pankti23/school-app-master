import React from 'react'
import './TeachersConfigHeader.css'

import { useDict } from "../../../UI/Translations"

const TeachersConfigHeader = () => {
  const dict = useDict("/configuration-page/teachers")

  return (
  <div className="teachers-config-header-container">
    <p className="teachers-config-header">{dict("main/header/title")}</p> 
    <p className="teachers-config-paragraph">{dict("main/header/paragraph")}</p>
  </div>
  )
}

export default TeachersConfigHeader
