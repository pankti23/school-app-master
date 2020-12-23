import React, { useEffect, useState } from 'react';

import '../../TeachersConfig.css';

import TeachersTableRow from './TeacherTableRow/TeacherTableRow';
import { removeAfterSchoolGroupTeacher } from "../../../../../services/afterSchoolGroupTeachersService";

import { getFields } from "../../../../../utils";

const AfterSchoolGroupTeachersList = (props) => {
	const { teachers, users, ids, setUpdated, groupId, afterSchoolGroups, campus, jwt } = props;

	const [searchByStaffName, setValueOfSearchByStaffName] = useState("");

	const [selectAll, setSelectAll] = useState(false);
  const [uncheckAll, setUncheckAll] = useState(false);
	const [checkedArray, setCheckedArray] = useState([]);

	const selectedTeachersCount = (checkedArray.filter(v => v)).length;

	const [filteredTeachers, setFilteredTeachers] = useState(teachers);

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

		const deleteSelectedAfterSchoolGroupTeachers = () => {
			idArray.forEach(async id => {
				const data = {
					"group_id": groupId,
					"user_id": id,
				}
				await removeAfterSchoolGroupTeacher(data);
			});
		};

		try {
			await Promise.all([deleteSelectedAfterSchoolGroupTeachers()]);
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
    
	  const teacherHasSelectedAfterSchoolGroups = teacherInfo && teacherInfo.AfterSchoolGroups ? getFields(teacherInfo.AfterSchoolGroups, 'name') : [];

			return (
				<TeachersTableRow
					jwt={jwt}
					uniqeID={`after-school-group-teachers-table-row-${ids}-${keyIdx}`}
					groupId={groupId}
					setUpdated={setUpdated}
					userId={id} 
					checked={checkedArray[keyIdx]}
					index={keyIdx}
					selectAll={selectAll}
					setChecked={handleCheck}
					setSelectAll={setSelectAll}
					setUncheckAll={setUncheckAll}
					afterSchoolTeacherDetail={teacherInfo}
					selectedTeachersCount={selectedTeachersCount}
					uncheckAll={uncheckAll}
					campusId={campus.id}
					afterSchoolGroups={afterSchoolGroups}
					teacherHasSelectedAfterSchoolGroups={teacherHasSelectedAfterSchoolGroups}
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
							id={`after-school-group-teachers-search-by-${ids}`} 
							name={`after-school-group-teachers-search-by-${ids}`}
							value={searchByStaffName || ''} 
							placeholder="Search staff" 
							onChange={handleInput} />
					</li>
					<li className="delete-staff">
						{
							!!selectedTeachersCount ? (<button
									onClick={handleSelectedRemove}
								>
									<span>
										Remove {selectedTeachersCount} Selected{" "}
										{selectedTeachersCount !== 1 ? "Person's" : "Person"}
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
									<input type="checkbox" id={`after-school-group-teachers-select-all-${ids}`} checked={selectAll} onClick={handleSelectAll}/>
									<label for={`after-school-group-teachers-select-all-${ids}`}>HTML</label>
								</div>
							</th>
							<th scope="col">Name</th>
							{/* <th scope="col">Extra-curricular Groups</th> */}
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredTeachers && filteredTeachers.length > 0 && renderTableRows(filteredTeachers)}
					</tbody>
			</table>
		</div>
  );
}

export default AfterSchoolGroupTeachersList;
