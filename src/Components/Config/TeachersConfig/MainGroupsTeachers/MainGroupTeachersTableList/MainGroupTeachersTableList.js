import React, { useState, useEffect } from 'react';

import '../../TeachersConfig.css';

import TeacherTableRow from './TeacherTableRow/TeacherTableRow';
import { updateGroup } from '../../../../../services/groupService'; 

import { useDict } from "../../../../UI/Translations"

const MainGroupTeachersTableList = (props) => {
	const { teachers, users, ids, gradeId, groupName, groupId, setUpdated, setIsLoading } = props;
	const [searchByStaffName, setValueOfSearchByStaffName] = useState("");

	const [selectAll, setSelectAll] = useState(false);
  const [uncheckAll, setUncheckAll] = useState(false);
	const [checkedArray, setCheckedArray] = useState([]);
	const selectedTeachersCount = (checkedArray.filter(v => v)).length;

	const [filteredTeachers, setFilteredTeachers] = useState(teachers);

  const dict = useDict("/configuration-page/teachers")

	useEffect(() => {
    setFilteredTeachers(teachers);
	},[teachers]);
	
	const filterIt = (searchKey) => {
		return filteredTeachers.filter((obj) =>  Object.values(obj).filter(() => obj.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1).length > 0)
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
				filteredTeachers.map(teacher => true)
			);
		} else {
			setUncheckAll(true);
			setSelectAll(false);
			setCheckedArray(checkedArray.map(v => false));
		}
	};
	
	const handleSelectedRemove = async () => {

    	const tempCheckedArray = checkedArray.filter((v, i) => !v);

		const tempFilteredTeachers = filteredTeachers.filter((v, i) => !checkedArray[i]);

		const idArray = filteredTeachers.filter((v, i) => checkedArray[i]).map(v => v.id);

		const deleteSelectedMainGroupTeachers = () => {
			idArray.forEach(async id => {
				
				const data = {
				"id": groupId,
				"name": groupName,
				"gradeId": gradeId,
				"mainTeacherId": null
				}

				await updateGroup(data);
			});
		};

    try {
		await Promise.all([deleteSelectedMainGroupTeachers()]);
		setUpdated(true);
		setCheckedArray(tempCheckedArray);
		setFilteredTeachers(tempFilteredTeachers);
		setSelectAll(false);
    } catch (e) {
		alert(e);
    }

  }

	const renderTableRows = (teachers) => {
		return teachers.map((teacher, keyIdx) => {
			const { id } = teacher;

			let teacherInfo = users.filter((user)=> {
				return user.id == id
			})[0];
		
			return (
				<TeacherTableRow
					setUpdated={setUpdated}
					setIsLoading={setIsLoading}
					groupId={groupId}
					gradeId={gradeId}
					groupName={groupName}
					mainTeacherId={id}
					ids={`main-teacher-table-tr-${ids}`} 
					checked={checkedArray[keyIdx]}
					index={keyIdx}
					selectAll={selectAll}
					setChecked={handleCheck}
					setSelectAll={setSelectAll}
					setUncheckAll={setUncheckAll}
					mainTeacher={teacherInfo}
					uncheckAll={uncheckAll}
				/>
			);
		})
	}

	const handleInput = (e) => {
		const { value } = e.target;
		setValueOfSearchByStaffName(value);

		if(value){
      let filteredArrayOfTeachers = filterIt(value);
      setFilteredTeachers(filteredArrayOfTeachers);
    } else {
      setFilteredTeachers(teachers);
    }
	}
	
  return (
    <div className={`teacher-table-${ids}`}>
			<ul className="table-header-row">
					<li className="searchbox">
							<a href="javascript:void(0)" className="search-icon">
									<i className="fa fa-search" aria-hidden="true"></i>
							</a>
							<input 
								type="text" 
								id={`main-teacher-search-by-${ids}`}
								id={`main-teacher-search-by-${ids}`}
								value={searchByStaffName || ''} 
								placeholder={dict("main-teachers/group/table/search-input")}
								onChange={handleInput} />
					</li>
					<li className="delete-staff">
						{
							!!selectedTeachersCount ? (<button
									onClick={handleSelectedRemove}
								>
									<span>
                    {`${dict("main-teachers/group/table/remove-selected-button")[0]} ${selectedTeachersCount} ${dict("main-teachers/group/table/remove-selected-button")[1]} ${selectedTeachersCount !== 1 ? dict("main-teachers/group/table/remove-selected-button")[3] : dict("main-teachers/group/table/remove-selected-button")[2]}`}
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
												<input type="checkbox" id={`main-teacher-table-th-${ids}`} checked={selectAll} onClick={handleSelectAll}/>
												<label for={`main-teacher-table-th-${ids}`}>HTML</label>
											</div>
									</th>
									<th scope="col">{dict("main-teachers/group/table/name")}</th>
									<th scope="col">{dict("main-teachers/group/table/last-activity")}</th>
									<th scope="col">{dict("main-teachers/group/table/actions")}</th>
							</tr>
					</thead>
					<tbody>
						{filteredTeachers && filteredTeachers.length > 0 && renderTableRows(filteredTeachers)}
					</tbody>
			</table>
		</div>
  );
}

export default MainGroupTeachersTableList;
