import React, { useState, useContext, useEffect } from 'react';

import '../../../AdminStaffConfig.css';

import AdministratorTableRow from './AdministratorTableRow';

import { useDict } from "../../../../../UI/Translations"

const AdministratorsTableList = props => {

	const { schoolAdmins } = props;

	const [adminsList, setAdminsList] = useState(schoolAdmins);

	const [searchByStaffName, setValueOfSearchByStaffName] = useState("");

  const dict = useDict("/configuration-page/admin-staff")

	const filterIt = (searchKey) => {
		return adminsList.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0)
	};

	const handleInput = (e) => {
		const { value } = e.target;
		setValueOfSearchByStaffName(value);

		if(value){
      let filteredArrayOfAdmins = filterIt(value);
      setAdminsList(filteredArrayOfAdmins);
    } else {
      setAdminsList(schoolAdmins);
    }
	}

	const renderTableRows = (admins) => {
		return admins.map((admin, adminKeyIdx) => {
			return (
				<AdministratorTableRow
					// ref={childRef}
					// ids={ids}
					admin={admin}
					// campusId={campusId}
					// campusName={campusName}
					// levelId={level.id}
					// levelName={level.name}
					// levelKeyIdx={levelKeyIdx}
					adminKeyIdx={adminKeyIdx}
					// setUpdated={setUpdated}
					// checked={checkedArray[adminKeyIdx]}
					// selectAll={selectAll}
					// setChecked={handleCheck}
					// setSelectAll={setSelectAll}
					// setUncheckAll={setUncheckAll}
					// uncheckAll={uncheckAll}
				/>
			)
		});
	}

	useEffect(() => {
		setAdminsList(schoolAdmins);
	}, [schoolAdmins]);


  return (
    <div key={`school-administrators-director-table-1`} className={`school-administrators-director-table-1`}>
			<ul className="table-header-row">
				<li className="searchbox">
						<a href="javascript:void(0)" className="search-icon">
							<i className="fa fa-search" aria-hidden="true"></i>
						</a>
						<input 
							type="text" 
							id="school-administrators-director-search-by-1"
							value={searchByStaffName || ''} 
							placeholder={dict("school/admin/table/search-input")}
							onChange={handleInput}
						/>
				</li>
				{/* <li className="delete-staff">
					<button
						onClick={() => {}}
					>
						<span>
							Eliminar 1 seleccionadas Personal
						</span>
					</button>
				</li> */}
			</ul>
			<table className="table table-bordered">
				<thead>
						<tr>
							{/* <th>
								<div className="form-group check-box">
									<input type="checkbox" id={`director-table-th-1`} />
									<label for={`director-table-th-1`}>HTML</label>
								</div>
							</th> */}
							<th scope="col">{dict("school/admin/table/name")}</th>
							{/* <th scope="col">Acciones</th> */}
						</tr>
				</thead>
				<tbody>
					{adminsList && adminsList.length > 0 ? renderTableRows(adminsList) : null}
				</tbody>
			</table>
		</div>
  )
}

export default AdministratorsTableList;
