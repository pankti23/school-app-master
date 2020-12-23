import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import './time-picker-styles.css';

function createMomentFromTime(time) {
  return moment(time, [moment.ISO_8601, 'HH:mm']);
}

function getTimeFromMoment(date) {
  return date.format('HH:mm');
}

const TimeInput = ({
  name, value, onChange, isRequired, format, showSecond,
}) => {
  const [timeValue, setTimeValue] = useState((value ? createMomentFromTime(value) : moment()));
  const handleChange = (newValue) => {
    setTimeValue(newValue);
    if (newValue) {
      return onChange(name, getTimeFromMoment(newValue));
    }
    onChange(name, newValue);
    return true;
  };

  return (
      <TimePicker
        defaultValue={timeValue}
        onChange={handleChange}
        showSecond={showSecond}
        placeholder={format}
        minuteStep={15}
        allowEmpty={false}
        required={isRequired}
      />
  );
};

TimeInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  showSecond: PropTypes.bool,
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TimeInput.defaultProps = {
  isRequired: false,
  format: 'hh:mm',
  showSecond: false
};

export default TimeInput;
