import React from "react";

import '../../../TeachersConfig.css';

const ListRow = (props) => {
  const {
    checked,
    index,
    setChecked,
    teacher
  } = props;

  const handleChecked = () => {
    if (checked) {
      setChecked(index, false);
    } else {
      setChecked(index, true);
    }
  };

  return (
    <div className="form-group check-box">
			<input type="checkbox" id={`name${teacher.id}${index}`} checked={checked} onChange={handleChecked}/>
			<label for={`name${teacher.id}${index}`}>{teacher.name || ''} <span>{`(${teacher.email})` || ''}</span></label>
    </div>
  );
};

export default ListRow;
