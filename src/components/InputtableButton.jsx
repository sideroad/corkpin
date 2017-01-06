import React, { Component, PropTypes } from 'react';

const styles = require('../css/inputtable-button.less');

// eslint-disable-next-line react/prefer-stateless-function
class InputtableButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: props.clicked !== undefined ? props.clicked : false,
      escaped: props.escaped !== undefined ? props.escaped : false
    };
  }

  componentDidMount() {
    if (this.props.focused) {
      this.input.focus();
    }
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
      placeholder,
      onClick = () => {},
      onChange = () => {}
    } = this.props;
    const {
      clicked,
      escaped
    } = this.state;
    const blur = () => this.setState({
      clicked: false,
      escaped: true
    });
    return (
      <div
        className={`${styles.container} ${className} ${clicked ? styles.clicked :
                                                       escaped ? styles.escaped : ''}`}
      >
        <button
          className={styles.button}
          onClick={() => {
            this.setState({
              clicked: true,
              escaped: false
            });
            this.input.focus();
            onClick();
          }}
        >
          <i className={`fa ${icon}`} aria-hidden="true" />{button}
        </button>
        <input
          ref={(c) => { this.input = c; }}
          className={styles.input}
          placeholder={placeholder}
          onKeyDown={(evt) => {
            switch (evt.key) {
              case 'Escape':
                blur();
                break;
              default:
            }
          }}
          onChange={evt => onChange(evt)}
          onBlur={() => blur()}
        />
        <i className={`fa ${icon} ${styles.prefix}`} aria-hidden="true" />
      </div>
    );
  }
}

InputtableButton.propTypes = {
  clicked: PropTypes.bool,
  escaped: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  focused: PropTypes.bool
};

export default InputtableButton;
