import React, {useState, useLayoutEffect} from "react";
import "./VisibilityFilter.css";

import VisibilityFilterView from "./VisibilityFilterView";
import Checkbox from "../../UI/Checkbox";

import {getTree, findInTree, updateAllNodes, updateParentNodes} from "../../../utils";

const VisibilityFilter = ({ isFrom, title, campuses, levels, grades, groups, afterSchoolGroups, updateVisibilityFilters, allChecked, setAllCheckedItems, setTypeFilters, setAllCheckedCalendarItems, setTypes, types }) => {
  const [tree, setTree] = useState([]);

  useLayoutEffect(() => {
    const treeObj = getTree(campuses, levels, grades, groups, afterSchoolGroups);
    setTree(treeObj);
    if(isFrom === "CalendarContainer"){
      treeObj.map((item) => {
        updateAllNodes(item, true);
      });
      const newTree = [...treeObj];
      updateParentNodes(newTree);
      updateVisibilityFilters(newTree);
      setAllCheckedItems(true);
    }
  }, []);

  const updateTree = (item) => {
    const thisItem = findInTree(item, tree);
    updateAllNodes(thisItem, item.isChecked);

    const newTree = [...tree];
    updateParentNodes(newTree);
    updateVisibilityFilters(newTree);
    setTree(newTree);
    if(isFrom === "CalendarContainer"){
      setAllCheckedItems(newTree.every(t => t.isChecked));
    }
  };

  const handleChange = (item) => {
    if(typeof item === "object"){
      let itemName = item.target.name;
      let checked = item.target.checked;

      if (itemName === "Select All") {
        setAllCheckedItems(checked);
        if(!checked){
          if(tree && tree.length > 0){
            tree.map((item) => {
              updateAllNodes(item, false);
            });
            const newTree = [...tree];
            updateParentNodes(newTree);
            updateVisibilityFilters(newTree);
            setTree(newTree);
          }
        } else {
          if(tree && tree.length > 0){
            tree.map((item) => {
              updateAllNodes(item, true);
            });
            const newTree = [...tree];
            updateParentNodes(newTree);
            updateVisibilityFilters(newTree);
            setTree(newTree);
          }
        }
      }
    }
  };

  return (
    <div className="visibility-filter-container">
      <p className="types-filter-title">{title}</p>
      <div className="visibility-filter-options">
        {isFrom === "CalendarContainer" && (
          <p className="visibility-filter-option">
            <Checkbox onChange={(e) => handleChange(e)} name={"Select All"} checked={allChecked} />
          </p>
        )}
        {
          tree.map(n =>
            (<VisibilityFilterView
              key={n.name}
              item={n}
              updateTree={updateTree}
            />)
          )
        }
      </div>
    </div>
  );
};

export default VisibilityFilter;
