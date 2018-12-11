import React from 'react';

import './index.scss';

const Button = props => {

  const type = props.type ? ` ${props.type}` : '';
  const classes = `button${type}`;

  if (props.href) {
    return (
      <a
        download={props.download}
        className={classes}
        onClick={props.onClick}
        href={props.href}>
        {props.label}
      </a>
    )
  }
  
  return (
    <button
      className={classes}
      onClick={props.onClick}>
      {props.label}
    </button>
  )
}

export default Button;