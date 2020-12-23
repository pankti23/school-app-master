import React from "react";

import '../../../../../AdminStaffConfig.css';

const ListRow = (props) => {
  const {
    checked,
    index,
    setChecked,
    principal
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
			<input type="checkbox" id={`name${principal.id}${index}`} checked={checked} onChange={handleChecked}/>
			<label for={`name${principal.id}${index}`}>{principal.name || ''} <span>{`(${principal.email})` || ''}</span></label>
    </div>
  );
};

export default ListRow;
