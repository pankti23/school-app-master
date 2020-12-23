import React, { useState, useEffect } from 'react';
import axios from "axios";

import '../../TeachersConfig.css';

import TeacherTableRow from './TeacherTableRow/TeacherTableRow';

const baseUrl = process.env.REACT_APP_BASE_URL;

function getFields(input, field) {
	var output = [];
	for (var i=0; i < input.length ; ++i)
			output.push(input[i][field]);
	return output;
}

const SubjectGroupTeachersList = (props) => {

	const { groupSubjectTeachers, groups, grades, teachers, jwt, users, campus, subject, ids, setUpdated, levels } = props;

	const [searchByStaffName, setValueOfSearchByStaffName] = useState("");
	const [filteredTeachers, setFilteredTeachers] = useState(teachers);
	const [selectAll, setSelectAll] = useState(false);
  	const [uncheckAll, setUncheckAll] = useState(false);
	const [checkedArray, setCheckedArray] = useState([]);

	const selectedTeachersCount = (checkedArray.filter(v => v)).length;

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

		setCheckedArray(tempCheckedArray);

		setFilteredTeachers(tempFilteredTeachers);

		setSelectAll(false);

		const selectedUsers = filteredTeachers.filter((v, i) => checkedArray[i]).map(v => {
			return {
				id: v.id,
				groups: v.Groups 
			}
		});

		const deleteSelectedSubjectTeachersFromGroups = async () => {
			selectedUsers.forEach(async selectedUser => {				
				if(selectedUser.groups && selectedUser.groups.length > 0){
					let groupIds = selectedUser.groups.map((group) => group.id);
					if(groupIds && groupIds.length > 0){
						groupIds.forEach(async id => {
							const data = {
							  "groupId": parseInt(id),
							  "subjectId": parseInt(subject.id),
							  "userId": parseInt(selectedUser.id)
							}
					
							const config = {
							  method: 'DELETE',
							  url: `${baseUrl}/groupSubjectTeachers/group/${data.groupId}/subject/${data.subjectId}/teacher/${data.userId}`,
							  headers: {
								'Authorization': jwt,
								'Content-Type': 'application/json'
							  }
							}
							await axios(config);
						});
					}
				}
			});
		};

		const deleteSelectedSubjectTeachersFromSubject = async () => {
			selectedUsers.forEach(async selectedUser => {	
				const config = {
					method: 'DELETE',
					url: `${baseUrl}/subjectTeachers/subject/${parseInt(subject.id)}/teacher/${parseInt(selectedUser.id)}`,
					headers: {
						'Authorization': jwt,
						'Content-Type': 'application/json'
					}
				}
				await axios(config);
			});
		};

		try {
			await Promise.all([deleteSelectedSubjectTeachersFromGroups(), setTimeout(() => { deleteSelectedSubjectTeachersFromSubject();})]);
			setUpdated(true);
		} catch (e) {
			console.log(e);
		}
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

	const renderTableRows = (teachers) => {
		return teachers.filter((opt) => opt.campusId === campus.id).map((teacher, keyIdx) => {
			const { id, levelId, userId } = teacher;

			let teacherInfo = users.filter((user)=> {
				return user.id == id && campus.id === user.campusId
			})[0];

			let selectedGrades = teacherInfo && teacherInfo.Grades ? getFields(teacherInfo.Grades, 'name') : [];
			let selectedGroups = teacherInfo && teacherInfo.Groups ? getFields(teacherInfo.Groups, 'name') : [];
			
			return (
				<TeacherTableRow
					ids={ids}
					index={keyIdx}
					subjectId={subject.id}
					levelId={levelId}
					selectedGrades={selectedGrades}
					selectedGroups={selectedGroups}
					levels={levels}
					campusId={campus.id}
          groupSubjectTeacher={groupSubjectTeachers.filter(v => v.userId === id)}
					groups={groups}
					grades={grades}
					allUsers={users}
					subjectTeacher={teacherInfo}
					subjectTeacherId={id}
					checked={checkedArray[keyIdx]}
					selectAll={selectAll}
					setChecked={handleCheck}
					setSelectAll={setSelectAll}
					setUncheckAll={setUncheckAll}
					uncheckAll={uncheckAll}
					setUpdated={setUpdated}
					selectedTeachersCount={selectedTeachersCount}
					jwt={jwt}
				/>
			);
		})
	}

  return (
    <div className="teacher-table" key={`subject-teachers-table-wrapper-${ids}`} id={`subject-teachers-table-wrapper-${ids}`}>
			<ul className="table-header-row">
					<li className="searchbox">
							<a href="#" className="search-icon">
								<i className="fa fa-search" aria-hidden="true"></i>
							</a>
							<input 
								type="text" 
								placeholder="Search staff"
								id={`search-by-subject-teachers-name-${campus.id}-${subject.id}`}
								name={`search-by-subject-teachers-name-${campus.id}-${subject.id}`}
								value={searchByStaffName || ''} 
								onChange={handleInput}  
							/>
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
			<table className="table table-bordered" id={`subject-teachers-table-${ids}`}>
					<thead>
							<tr>
									<th>
											<div className="form-group check-box">
													<input 
														type="checkbox" 
														id={`subject-teachers-table-th-${ids}`}
														checked={selectAll} 
														onClick={handleSelectAll} 
													/>
													<label for={`subject-teachers-table-th-${ids}`}>HTML</label>
											</div>
									</th>
									<th scope="col">Name</th>
									<th scope="col">Grade(s)</th>
									<th scope="col">Group(s)</th>
									<th scope="col">Actions</th>
							</tr>
					</thead>
					<tbody>
						{teachers && teachers.length > 0 && renderTableRows(teachers)}
					</tbody>
			</table>
		</div>
  );
}

export default SubjectGroupTeachersList;
