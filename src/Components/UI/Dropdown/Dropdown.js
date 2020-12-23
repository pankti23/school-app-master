import React from "react";

import useOutsideClick from "../../../CustomHooks/useOutsideClick";

import "./Dropdown.css";

const Dropdown = (props) => {
  const { closeDropdown, dropdownItems, id, style } = props;

  const ref = React.useRef(null);

  const handleItemClick = (onClick) => {
    onClick && onClick();

    closeDropdown();
  };

  const getPosition = (id) => {
    const element = document.getElementById(id);

    if (element) {
      const position = element.getBoundingClientRect();

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      return [position.left, position.bottom + scrollY + 4];
    } else {
      return [];
    }
  };

  useOutsideClick(closeDropdown, ref);

  return (
    <div
      className="dropdown-container"
      ref={ref}
      style={{
        left: getPosition(id)[0],
        opacity: dropdownItems ? (dropdownItems.length === 0 ? "0" : "1") : "0",
        top: getPosition(id)[1],
        width: style && style.width ? style.width : "auto"
      }}
    >
      {dropdownItems.map((v, i) => (
        <div key={i}>
          <button
            className="dropdown-item-button"
            onClick={() => handleItemClick(v.onClick)}
          >
            <div className="dropdown-item-text-container">
              <span
                className="dropdown-item-text"
                style={{
                  fontSize: style && style.fontSize ? style.fontSize : "initial"
                }}
              >
                {v.value}
              </span>
            </div>
          </button>

          {i < dropdownItems.length - 1 && (
            <div className="dropdown-item-divider" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
