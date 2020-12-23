import React from "react";

import "./ModalContainer.css";

const ModalContainerBottom = (props) => {
  const { children } = props;

  return (
    <>
      <div className="modal-container-divider" />

      <div className="modal-container-bottom">{children}</div>
    </>
  );
};

const ModalContainerMiddle = (props) => {
  const { children } = props;

  return (
    <>
      <div className="modal-container-divider" />

      <div className="modal-container-middle">{children}</div>
    </>
  );
};

const ModalContainerTop = (props) => {
  const { children, style } = props;

  return (
    <div className="modal-container-top" style={style}>
      {children}
    </div>
  );
};

export { ModalContainerBottom, ModalContainerMiddle, ModalContainerTop };
