import React from 'react'
import './AdminStaffConfigHeader.css'

import { useDict } from "../../../UI/Translations"

const AdminStaffConfigHeader = () => {
  const dict = useDict("/configuration-page/admin-staff")

  return (
    <div className="admin-staff-config-header-container">
      <p className="admin-staff-config-header">{dict("main/header/title")}</p> 
      <p className="admin-staff-config-paragraph">{dict("main/header/paragraph")}</p>
    </div>
  )
}

export default AdminStaffConfigHeader;
