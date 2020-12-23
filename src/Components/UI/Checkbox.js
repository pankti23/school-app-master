import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.css'

const Checkbox = ({type, name, checked, color, onChange}) => {
  const labelColor = color ? color : '';
  return (
    <label style={{color: labelColor}}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
      />
      {name}
    </label>
  )
};

Checkbox.defaultProps = {
  color: '',
  type: 'checkbox',
  checked: false
};

Checkbox.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
