import React from "react";
import Checkbox from "../../UI/Checkbox";

const VisibilityFilterView = ({item, updateTree}) => {

  const handleChange = (item) => {
    const { id, name, isChecked } = item;
    const checked = !(isChecked || false);
    updateTree({id, name, isChecked: checked });
  };

  const padding = 20 * (('depth' in item) && item.depth === 0 ? 0 : item.depth || 3);
  // console.log(item.name, item.depth, padding);
  return (
    <>
      {
        item.children ? (
          <React.Fragment key={item.name}>
            <p key={item.name} className="visibility-filter-option" style={{ paddingLeft: padding }}>
              <Checkbox onChange={() => handleChange(item)} name={item.name} checked={item.isChecked || false} />
            </p>
            {item.children.map(n => (<VisibilityFilterView key={n.name} item={n} updateTree={updateTree} />))}
          </React.Fragment>
        ) : (
          <p key={item.name} className="visibility-filter-option" style={{ paddingLeft: padding }}>
            <Checkbox onChange={() => handleChange(item)} name={item.name} checked={item.isChecked || false} />
          </p>
        )
      }
    </>
  );
};

export default VisibilityFilterView;
