import React, { Component, PropTypes } from 'react';

const styles = require('../css/inputtable-button.less');

// eslint-disable-next-line react/prefer-stateless-function
class Button extends Component {
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
      button,
      onClick = () => {},
      disabled = false
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
        <button
          className={`${styles.button} ${disabled ? styles.disabled : ''}`}
          onClick={() => {
            if (!disabled) {
              this.setState({
                clicked: this.state.clicked !== true,
                escaped: this.state.clicked === true
              });
              onClick();
            }
          }}
        >
          <i className={`fa ${icon}`} aria-hidden="true" />{button}
        </button>
      </div>
    );
  }
}

Button.propTypes = {
  disabled: PropTypes.bool,
  clicked: PropTypes.bool,
  escaped: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default Button;
