import React, { useState, useContext, useEffect } from 'react';

import '../../../../AdminStaffConfig.css';

const AdministratorTableRow = props => {

  const {
    admin
  } = props;

  return (
    <tr>
      {/* <td>
        <div className={`form-group check-box`}>
            <input type="checkbox" id={`director-table-td-1`}/>
            <label for={`director-table-td-1`}>HTML</label>
        </div>
      </td> */}
      <td>{`${admin.name} (${admin.email})`}</td>
      {/* <td><button type="button" className="remove">Eliminar</button>
      </td> */}
    </tr>
  )
}

export default AdministratorTableRow;
