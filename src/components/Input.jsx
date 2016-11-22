import React, { Component, PropTypes } from 'react';

const styles = require('../css/input.less');

// eslint-disable-next-line react/prefer-stateless-function
class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: props.clicked !== undefined ? props.clicked : false,
      escaped: props.escaped !== undefined ? props.escaped : false
    };
  }

  componentWillReceiveProps(props) {
    const state = {};
    if (props.clicked !== undefined) {
      state.clicked = props.clicked;
    }
    if (props.escaped !== undefined) {
      state.escaped = props.escaped;
    }
    this.setState(state);
  }

  render() {
    const {
      icon = '',
      className = '',
      placeholder = '',
      value = '',
      onBlur = () => {},
      onKeyDown = () => {},
      onChange = () => {}
    } = this.props;
    const {
      clicked,
      escaped
    } = this.state;
    return (
      <div
        className={`${styles.container} ${className} ${clicked ? styles.clicked :
                                                       escaped ? styles.escaped : ''}`}
      >
        <input
          ref={(c) => { this.input = c; }}
          className={styles.input}
          placeholder={placeholder}
          defaultValue={value}
          onChange={evt => onChange(evt)}
          onKeyDown={evt => onKeyDown(evt)}
          onBlur={evt => onBlur(evt)}
        />
        <i className={`fa ${icon} ${styles.prefix}`} aria-hidden="true" />
      </div>
    );
  }
}

Input.propTypes = {
  clicked: PropTypes.bool,
  escaped: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func
};

export default Input;
