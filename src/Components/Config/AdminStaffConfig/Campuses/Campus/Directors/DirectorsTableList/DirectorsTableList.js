import React, { useState, useContext, useEffect, useRef } from 'react';

import '../../../../AdminStaffConfig.css';

import DirectorTableRow from './DirectorTableRow';

import { useDict } from '../../../../../../UI/Translations'

const DirectorsTableList = props => {

	const { campusId, campusName, campusKeyIdx, campusesPrincipals, ids, setUpdated } = props;

	const [principalsList, setPrincipalsList] = useState(campusesPrincipals);

	const [selectAll, setSelectAll] = useState(false);
  const [uncheckAll, setUncheckAll] = useState(false);
	const [checkedArray, setCheckedArray] = useState([]);

	const [searchByStaffName, setValueOfSearchByStaffName] = useState("");

  const dict = useDict("/configuration-page/admin-staff")

	const childRef = useRef();

	const selectedPrincipalsCount = (checkedArray.filter(v => v)).length;

	const filterIt = (searchKey) => {
		return principalsList.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0)
	};

	const handleCheck = (index, bool) => {
		const arr = checkedArray.map(v => v);
		arr[index] = bool;
		setCheckedArray(arr);
	};

	const handleSelectAll = () => {
    if (!selectAll) {
			setSelectAll(true);
      setCheckedArray(
        principalsList.filter((opt) => opt.campusId === campusId).map(teacher => true)
      );
    } else {
      setUncheckAll(true);
      setSelectAll(false);
      setCheckedArray(checkedArray.map(v => false));
    }
	};

	const handleInput = (e) => {
		const { value } = e.target;
		setValueOfSearchByStaffName(value);

		if(value){
      let filteredArrayOfPrincipals = filterIt(value);
      setPrincipalsList(filteredArrayOfPrincipals);
    } else {
      setPrincipalsList(campusesPrincipals);
    }
	}

	const handleSelectedRemove = async () => {
		const tempCheckedArray = checkedArray.filter((v, i) => !v);

		const tempFilteredPrincipal = principalsList.filter((v, i) => !checkedArray[i]);

		setCheckedArray(tempCheckedArray);

		setPrincipalsList(tempFilteredPrincipal);

		setSelectAll(false);

		childRef.current.remove();
	}

	const renderTableRows = (principals) => {
		return principals.filter((opt) => opt.campusId === campusId).map((principal, principalKeyIdx) => {
			return (
				<DirectorTableRow
					ref={childRef}
					ids={ids}
					principal={principal}
					campusId={campusId}
					campusName={campusName}
					principalKeyIdx={principalKeyIdx}
					setUpdated={setUpdated}
					checked={checkedArray[principalKeyIdx]}
					selectAll={selectAll}
					setChecked={handleCheck}
					setSelectAll={setSelectAll}
					setUncheckAll={setUncheckAll}
					uncheckAll={uncheckAll}
				/>
			)
		});
	}

	useEffect(() => {
		setPrincipalsList(campusesPrincipals);
	}, [campusesPrincipals]);

  return (
    <div key={`${campusName}-${campusId}-director-table-${campusKeyIdx}`} className={`${campusName}-${campusId}-director-table-${campusKeyIdx}`}>
			<ul className="table-header-row">
				<li className="searchbox">
						<a href="javascript:void(0)" className="search-icon">
							<i className="fa fa-search" aria-hidden="true"></i>
						</a>
						<input 
							type="text" 
							id={`director-search-by-${ids}`}
							value={searchByStaffName || ''} 
							placeholder={dict("campus/table/search-input")}
							onChange={handleInput}
						/>
				</li>
				<li className="delete-staff">
					{
						!!selectedPrincipalsCount ? (<button
								onClick={handleSelectedRemove}
							>
								<span>
                  {`${dict("campus/table/remove-selected-button")[0]} ${selectedPrincipalsCount} ${dict("campus/table/remove-selected-button")[1]} ${selectedPrincipalsCount !== 1 ? dict("campus/table/remove-selected-button")[3] : dict("campus/table/remove-selected-button")[2]}`}
								</span>
							</button>) :
							(
								<div>
								</div>)
					}
				</li>
			</ul>
			<table className="table table-bordered">
				<thead>
						<tr>
							<th>
								<div className="form-group check-box">
									<input type="checkbox" id={`director-table-th-${ids}`} checked={selectAll} onClick={handleSelectAll} />
									<label for={`director-table-th-${ids}`}>HTML</label>
								</div>
							</th>
							<th scope="col">{dict("campus/table/name")}</th>
							<th scope="col">{dict("campus/table/actions")}</th>
						</tr>
				</thead>
				<tbody>
					{principalsList && principalsList.length > 0 ? renderTableRows(principalsList) : null}
				</tbody>
			</table>
		</div>
  )
}

export default DirectorsTableList;
