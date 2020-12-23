import React from 'react';

import { Link } from 'react-router-dom';

import './Button.css';

const Button = ({ children, onClick, disabled, color, margin, icon, image, width, className, size, style, type, form, to, href }) => {
  let classList = ['ui-button', className, color, size];

  if (width === '100%') {
    classList.push('fullWidth');
  }

  if (!children) {
    classList.push('iconOnly');
  }

  if (disabled) {
    classList.push('disabled');
  }

  return (
    <>
      {!to && !href && <button className={classList.join(' ')}
        disabled={disabled}
        style={{ margin, width, ...style }}
        type={type || 'button'}
        form={form}
        onClick={onClick}>
        {icon}
        {image && <img src={image} alt="" />}
        {children}
      </button>}

      {to && <Link to={to} className={classList.join(' ')}
        disabled={disabled}
        style={{ margin, width, ...style }}
        onClick={onClick}>
        {icon}
        {image && <img src={image} alt="" />}
        {children}
      </Link>}

      {href && <a href={href}
        className={classList.join(' ')}
        disabled={disabled}
        style={{ margin, width, ...style }}
        onClick={onClick}>
        {icon}
        {image && <img src={image} alt="" />}
        {children}
      </a>}
    </>
  );
};

export default Button;
