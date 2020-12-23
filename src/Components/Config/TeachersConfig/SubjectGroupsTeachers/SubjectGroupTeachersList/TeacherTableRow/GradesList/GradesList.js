import React, { useEffect, useState } from "react";
import axios from "axios";

import '../../../../TeachersConfig.css';

const baseUrl = process.env.REACT_APP_BASE_URL;

const GradesList = (props) => {
  	const {
		jwt,
		checked,
		index,
		setChecked,
		levelIndex,
		campusId,
		currentRowIdx,
		subjectId,
		setUpdated,
		gradeId,
    groupSubjectTeacher,
		subjectTeacherId,
		levelName,
		groups,
    	grade
	} = props;

	const [isChecked, setIsChecked] = useState(false);
  
  const [disable, setDisable] = useState(false)

	useEffect(() => {
		setIsChecked(checked);
	},[checked]);

  const groupsbyGradeId = groupSubjectTeacher.filter(v => v.Group.gradeId === gradeId).filter(v => v.subjectId === subjectId).map(v => v.groupId)

  const groupsbyGradeId2 = groups.filter((group) => group.gradeId === grade.id).map((opt) => opt.id).filter(v => !groupsbyGradeId.includes(v));
	
	const handleAdd = async () => {
		const addSubjectTeacherToGroups = async () => {
      console.log(groupsbyGradeId2)
			await groupsbyGradeId2.forEach(async id => {
				const data = {
					"groupId": parseInt(id),
					"subjectId": parseInt(subjectId),
					"userId": parseInt(subjectTeacherId)
				}

				const config = {
					method: 'POST',
					url: `${baseUrl}/groupSubjectTeachers`,
					data: data,
					headers: {
					  'Authorization': jwt,
					  'Content-Type': 'application/json'
					}
				}
				await axios(config);
        setDisable(false)
			});
		};

		try {
      if (!disable) {
        setDisable(true)
        await addSubjectTeacherToGroups();
        setUpdated(true);
      }
		} catch (e) {
      setDisable(false)
			console.log(e);
		}
	}
	
	const handleRemove = async () => {
		const deleteSubjectTeacherFromGroups = async () => {
      console.log(groupsbyGradeId)
			await groupsbyGradeId.forEach(async id => {
				const data = {
					"groupId": parseInt(id),
					"subjectId": parseInt(subjectId),
					"userId": parseInt(subjectTeacherId)
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
        setDisable(false)
			});
		};

		try {
      if (!disable) {
        setDisable(true)
        await deleteSubjectTeacherFromGroups();
        setUpdated(true);
      }
		} catch (e) {
      setDisable(false)
			console.log(e);
		}
	};

	const handleChecked = () => {
		if (isChecked) {
			setChecked(gradeId, false);
			handleRemove();
		} else {
			setChecked(gradeId, true);
			handleAdd();
		}
	};

	return (
		<li key={`${campusId}-${subjectId}-${levelIndex}-${currentRowIdx}-${index}-${subjectTeacherId}`}>
			<div className="form-group check-box">
				<input disabled={disable} type="checkbox" id={`li-${campusId}-${subjectId}-${levelIndex}-${currentRowIdx}-${index}-${grade.id}-${subjectTeacherId}`} checked={isChecked} onChange={handleChecked} />
				<label for={`li-${campusId}-${subjectId}-${levelIndex}-${currentRowIdx}-${index}-${grade.id}-${subjectTeacherId}`}>{grade.name || ''}</label>
			</div>
		</li>
	);
};

export default GradesList;
