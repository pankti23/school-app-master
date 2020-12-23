import React from "react";

const getItemStyles = (color) => ({backgroundColor: color});

export default ({item, onClick}) => (
  <React.Fragment>
    {
      item.subject &&
      (<div
        className="item-data"
        style={getItemStyles(item.ItemType.color)}
        onClick={onClick}
      >
        <div>{item.subject}</div>
        <div>{item.location}</div>
      </div>)
    }
  </React.Fragment>
);
