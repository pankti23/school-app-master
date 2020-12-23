import React from 'react';
import Modal from 'react-responsive-modal';

import './Dialog.css';

export default ({
                  open, header, labelPrimary, labelSecondary, closeOnOverlayClick,
                  onClickPrimary, onClose, children, repeats, data
}) => {
  const closeOnOuterClick = closeOnOverlayClick !== undefined && closeOnOverlayClick !== null ? closeOnOverlayClick : true;
  let labelForPrimary = labelPrimary;
  let labelForPrimaryAll = '';
  if (repeats) {
    labelForPrimary = labelPrimary + ' this item only';
    labelForPrimaryAll = labelPrimary + ' for all future dates';
  }

  const applyToAllDates = (e) => {
    if (!data) {
      onClickPrimary(e, true);
    } else {
      onClickPrimary(data, true);
      onClose();
    }
  }

  const applyToThisDate = (e) => {
    if (!data) {
      onClickPrimary(e, false);
    } else {
      onClickPrimary(data, false);
      onClose();
    }
  }


  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnOverlayClick={closeOnOuterClick}
      center
    >
      <div className="dialog-container">
        <header className="dialog-header">
          <h3>{header}</h3>
        </header>
        <main className="dialog-content">
          {children}
        </main>
        <footer className="dialog-buttons-container">
          <button className="dialog-button dialog-button-secondary" onClick={onClose}>{labelSecondary}</button>
          {
            repeats && <button className="dialog-button dialog-button-primary-all" onClick={applyToAllDates}>{labelForPrimaryAll}</button>
          }
          <button className="dialog-button dialog-button-primary" onClick={applyToThisDate}>{labelForPrimary}</button>
        </footer>
      </div>
    </Modal>
  );
}
