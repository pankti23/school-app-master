import React from "react";

import useOutsideClickHook from "../../../CustomHooks/useOutsideClick";

import "./Modal2.css";

const Modal2 = (props) => {
  const { children, displayModal, handleClose } = props;

  const ref = React.useRef(null);

  useOutsideClickHook(handleClose, ref);

  return (
    <span>
      {displayModal && (
        <div className="modal2-wrapper">
          <div className="modal2-container" ref={ref}>
            {children}
          </div>
        </div>
      )}
    </span>
  );
};

export default Modal2;
