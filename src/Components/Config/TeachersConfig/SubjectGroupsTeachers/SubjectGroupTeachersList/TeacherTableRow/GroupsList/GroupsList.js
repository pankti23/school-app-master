import React, { useEffect, useState }  from "react";
import axios from "axios";

import '../../../../TeachersConfig.css';

const baseUrl = process.env.REACT_APP_BASE_URL;

const GroupsList = (props) => {
  const {
		jwt,
		checked,
		index,
		setChecked,
		levelIndex,
		gradeIndex,
		currentRowIdx,
		campusId,
		setUpdated,
		subjectId,
		groupId,
		subjectTeacherId,
		group,
		gradeName
	} = props;

	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		setIsChecked(checked);
	},[checked]);
	
	const handleAdd = async () => {
		const config = {
		  method: 'POST',
		  url: `${baseUrl}/groupSubjectTeachers`,
		  data: {
		    "subjectId": parseInt(subjectId),
		    "groupId": parseInt(groupId),
		    "userId": parseInt(subjectTeacherId)
		  },
		  headers: {
		    'Authorization': jwt,
		    'Content-Type': 'application/json'
		  }
		}
		
		try {
		  await axios(config);
		  setUpdated(true);
		} catch (err) {
		  console.error(err);
		}
	}

	const handleRemove = async () => {
		const data = {
			"groupId": parseInt(groupId),
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

		try {
			await axios(config);
			setUpdated(true);
		} catch (e) {
			console.log(e);
		}
	}

	const handleChecked = () => {
		if (isChecked) {
			setChecked(groupId, false);
			handleRemove();
		} else {
			setChecked(groupId, true);
			handleAdd();
		}
	};

	return (
		<li key={`${campusId}-${subjectId}-${levelIndex}-${gradeIndex}-${currentRowIdx}-${index}-${subjectTeacherId}`}>
			<div className="form-group check-box">
				<input type="checkbox" id={`li-${campusId}-${subjectId}-${levelIndex}-${gradeIndex}-${currentRowIdx}-${index}-${group.id}-${subjectTeacherId}`} checked={isChecked} onChange={handleChecked} />
				<label for={`li-${campusId}-${subjectId}-${levelIndex}-${gradeIndex}-${currentRowIdx}-${index}-${group.id}-${subjectTeacherId}`}>{group.name || ''}</label>
			</div>
		</li>
	);
};

export default GroupsList;
