import React from "react";
import axios from "axios";

import '../../../../TeachersConfig.css';
import { removeAfterSchoolGroupTeacher } from "../../../../../../../services/afterSchoolGroupTeachersService";

const baseUrl = process.env.REACT_APP_BASE_URL;

const ExtraCurricularActivitiesList = (props) => {
  const {
		jwt,
    checked,
    index,
		setChecked,
		setUpdated,
		groupId,
		userId,
    afterSchoolGroup
	} = props;
	
	const handleAdd = async () => {
    const config = {
      method: 'POST',
      url: `${baseUrl}/afterSchoolGroupTeachers`,
      data: {
        "groupId": groupId,
        "userId": userId
      },
      headers: {
        'Authorization': jwt,
        'Content-Type': 'application/json'
      }
		}
		
    try {
      const { status, data } = await axios(config);
      setUpdated(true);
    } catch (err) {
      console.error(err)
    }
	}
	
	const handleRemove = async id => {
    const data = {
      "group_id": groupId,
      "user_id": userId
    }
    const deleteAfterSchoolGroupTeacher = async () => {
      const deleteResponse = await removeAfterSchoolGroupTeacher(data);

      if (deleteResponse.status === 200) {
				console.log(deleteResponse);
      }
    };

    try {
      deleteAfterSchoolGroupTeacher();
      setUpdated(true)
    } catch (e) {
      alert(e);
    }
  };

  const handleChecked = () => {
    if (checked) {
			setChecked(index, false);
			handleRemove()
    } else {
			setChecked(index, true);
			handleAdd();
    }
  };

  return (
		<li key={`${index}`}>
			<div className="form-group check-box" style={{ opacity: 0.5 }}>
				<input type="checkbox" id={`li-${index}${afterSchoolGroup.id}`} disabled checked={checked} onChange={handleChecked} />
				<label for={`li-${index}${afterSchoolGroup.id}`}>{afterSchoolGroup.name || ''}</label>
			</div>
		</li>
  );
};

export default ExtraCurricularActivitiesList;
