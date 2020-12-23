import React, { useState, useContext, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import axios from "axios";

import '../../../../../AdminStaffConfig.css';

import { UserContext } from '../../../../../../../../Contexts/UserContext';

import { useDict } from "../../../../../../../UI/Translations"

const baseUrl = process.env.REACT_APP_BASE_URL;

const DirectorTableRow = forwardRef((props, ref)  => {

  const {
    ids,
    principal,
    campusId,
    campusName,
    principalKeyIdx,
    setUpdated,
    checked,
    selectAll,
    setChecked,
    setSelectAll,
    setUncheckAll,
    uncheckAll
  } = props;

  const dict = useDict("/configuration-page/admin-staff")

  const userData = useContext(UserContext);
  
  const handleChecked = () => {
    if (checked) {
      setChecked(principalKeyIdx, false);
    } else {
      setChecked(principalKeyIdx, true);
    }

    if (selectAll) {
      setSelectAll(false);
    }
  };

  useEffect(() => {
    if (uncheckAll) {
      setChecked(principalKeyIdx, false);
      setUncheckAll(false);
    }
  }, [uncheckAll, setUncheckAll]);

  const handleRemove = async () => {

    const config = {
      method: 'PUT',
      url: `${baseUrl}/campuses/${campusId}`,
      data: {
        "removePrincipal": true
      },
      headers: {
        'Authorization': userData.jwt,
        'Content-Type': 'application/json'
      }
    }

    try {
      await axios(config);
      setUpdated(true);
    } catch (err) {
      console.error(err)
    }
  };

  useImperativeHandle(ref, () => ({

    remove() {
      handleRemove();
    }

  }));

  return (
    <tr key={`${ids}-${principalKeyIdx}-${principal.id}-${principal.name}`} id={`${ids}-${principalKeyIdx}-${principal.id}-${principal.name}`}>
			<td>
				<div className={`form-group check-box`}>
						<input type="checkbox" id={`director-table-td-${ids}-${principalKeyIdx}-${principal.id}-${principal.name}`} checked={checked} onChange={handleChecked} />
						<label for={`director-table-td-${ids}-${principalKeyIdx}-${principal.id}-${principal.name}`}>HTML</label>
				</div>
			</td>
			<td>{`${principal.name} (${principal && principal.email})`}</td>
			<td><button type="button" className="remove" onClick={()=> handleRemove()}>{dict("campus/table/remove-button")}</button></td>
		</tr>
  );
});

export default DirectorTableRow;
