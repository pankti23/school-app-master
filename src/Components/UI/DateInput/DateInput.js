import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-date-picker';

import './DateInput.css';

const DateInput = ({
                     name, value, onChange, required, format,
                     dayPlaceholder, monthPlaceholder, yearPlaceholder,
                     customClassName
                   }) => {

  return (
    <DatePicker
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      format={format}
      dayPlaceholder={dayPlaceholder}
      monthPlaceholder={monthPlaceholder}
      yearPlaceholder={yearPlaceholder}
      className={customClassName}
      clearIcon={null}
      calendarIcon={null}
    />
  );
};


DateInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOf([null, PropTypes.instanceOf(Date)]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  format: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  monthPlaceholder: PropTypes.string,
  yearPlaceholder: PropTypes.string,
  customClassName: PropTypes.string,
};

DateInput.defaultProps = {
  dayPlaceholder: 'dd',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'yyyy',
  required: false,
  format: 'mm/dd/yyyy',
  showSecond: false,
  customClassName: ''
};

export default DateInput;
