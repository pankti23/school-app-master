import React, {useState} from "react";
import "./ItemTypesFilter.css"

import Checkbox from "../../UI/Checkbox";

import { useDict } from "../../UI/Translations"

const ItemTypesFilter = ({types, addTypeFilter, allChecked}) => {
  const dict = useDict("/calendar")

  return (
    <div className="types-filter-container">
      <p className="types-filter-title">{dict("sidebar/filter-label")}</p>
      <div className="types-filter-options">
        <p className="types-filter-option">
          <Checkbox
            color="#8B0000"
            name="Select All"
            checked={allChecked}
            onChange={(e) => addTypeFilter(e)}
          />
        </p>
        {
          types.map(item => (
            <p key={item.id} className="types-filter-option">
              <Checkbox
                color={item.color}
                name={item.name}
                checked={item.isChecked || false}
                onChange={() => addTypeFilter(item.id)}
              />
            </p>
          ))
        }
      </div>
    </div>
  );
};

export default ItemTypesFilter;
