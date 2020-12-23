import React from "react";

import { useOnOutsideClick } from "../../../CustomHooks/useOnOutsideClick";

import "./ModalWrapper.css";

const ModalWrapper = (props) => {
  const { children, displayModal, handleClose, noContainer, width } = props;

  const ref = React.useRef(null);

  useOnOutsideClick(handleClose, ref);

  return (
    <span>
      {displayModal && (
        <div className="modal-overlay">
          <div className="modal-wrapper">
            <div
              className={!noContainer && "modal-container"}
              style={{ width: width }}
            >
              <div
                className={!noContainer && "modal-inner-container"}
                ref={ref}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default ModalWrapper;
