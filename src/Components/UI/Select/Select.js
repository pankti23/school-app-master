import React from 'react';

import { Link } from 'react-router-dom';

import './Select.css';

const Select = ({ children, onClick, onChange, disabled, color, margin, width, className, size }) => {
  let classList = ['ui-select', className, color, size];

  if (width === '100%') {
    classList.push('fullWidth');
  }

  if (disabled) {
    classList.push('disabled');
  }

  return (
    <select className={classList.join(' ')}
      disabled={disabled}
      onClick={onClick}
      onChange={onChange}
      style={{ margin, width }}>
      {children}
    </select>
  );
};

export default Select;
