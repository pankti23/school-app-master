import React, {useEffect} from "react";

import '../../../TeachersConfig.css';

import { updateGroup } from '../../../../../../services/groupService'; 
import moment from "moment";

import { useDict } from "../../../../../UI/Translations"

const TeacherTableRow = (props) => {
  const {
    checked,
    groupId,
    ids,
    gradeId,
    groupName,
    mainTeacherId,
    index,
    selectAll,
    setChecked,
    setSelectAll,
    setUncheckAll,
    mainTeacher,
    uncheckAll,
    setUpdated,
    setIsLoading,
  } = props;

  const dict = useDict("/configuration-page/teachers")

  const handleChecked = () => {
    if (checked) {
      setChecked(index, false);
    } else {
      setChecked(index, true);
    }

    if (selectAll) {
      setSelectAll(false);
    }
  };

  useEffect(() => {
    if (uncheckAll) {
      setChecked(index, false);
      setUncheckAll(false);
    }
  }, [uncheckAll, setUncheckAll]);

  const handleRemove = async (groupName, gradeId, groupId, mainTeacherId) => {

    const data = {
      "id": groupId,
      "name": groupName,
      "gradeId": gradeId,
      "mainTeacherId": null
    }

    const deleteMainTeacherFromGroup = async () => {
      const deleteResponse = await updateGroup(data);

      if (deleteResponse.status === 200) {
        setSelectAll(false);
      }
    };

    try {
      deleteMainTeacherFromGroup();
      setUpdated(true);
      setIsLoading(false);
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };

  return (
    <tr key={`${ids}-${index}-${mainTeacherId}`}>
			<td>
				<div className={`form-group check-box`}>
						<input type="checkbox" id={`${ids}-td-${index}-${mainTeacherId}`} checked={checked} onChange={handleChecked} />
						<label for={`${ids}-td-${index}-${mainTeacherId}`}>HTML</label>
				</div>
			</td>
			<td>{`${mainTeacher && 'name' in mainTeacher && mainTeacher.name} (${mainTeacher && 'email' in mainTeacher && mainTeacher.email})`}</td>
      <td style={{ textAlign: 'center' }}>{mainTeacher && 'lastLogin' in mainTeacher && mainTeacher.lastLogin ? moment(mainTeacher.lastLogin).fromNow(): '-'}</td>
			<td><button type="button" className="remove" onClick={()=> handleRemove(groupName, gradeId, groupId, mainTeacherId)}>{dict("main-teachers/group/table/remove-button")}</button></td>
		</tr>
  );
};

export default TeacherTableRow;
