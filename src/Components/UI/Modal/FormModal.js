import React from 'react';
import Modal from 'react-responsive-modal';

import './Dialog.css';

export default ({open, onClose, closeOnOverlayClick, children}) => {
  const closeOnOuterClick = closeOnOverlayClick !== undefined && closeOnOverlayClick !== null ? closeOnOverlayClick : true;
  return (
    <div className="form-modal-container">
        <Modal
            open={open}
            onClose={onClose}
            closeOnOverlayClick={closeOnOuterClick}
            center
            classNames={{ modal: 'modal-container' }}
        >
            {children}
        </Modal>
    </div>
  );
}
