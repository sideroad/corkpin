import React, { PropTypes, Component } from 'react';
import TetherComponent from 'react-tether';
import { Input } from 'koiki-ui';
import IconButton from '../components/IconButton';

const styles = require('../css/suggest.less');

const handleClickOutside = (evt, input, suggest, onBlur) => {
  if ((!input || !input.input || !input.input.contains(evt.target)) &&
      (!suggest || !suggest.contains(evt.target))
  ) {
    onBlur();
  }
};

class Suggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }
  componentDidMount() {
    this.wrappedHandleClickOutside = evt =>
      handleClickOutside(evt, this.input, this.suggest, this.props.onBlur);
    document.addEventListener('click', this.wrappedHandleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.wrappedHandleClickOutside, true);
  }

  render() {
    const {
      onChange,
      onSelect,
      items
    } = this.props;

    return (
      <TetherComponent
        attachment="top left"
        targetAttachment="bottom left"
      >
        <Input
          className={styles.text}
          ref={(elem) => { this.input = elem; }}
          icon={`fa-users ${styles.inputIcon}`}
          placeholder="Search and enter to allow users"
          value={this.state.query}
          onChange={
            (evt) => {
              this.setState({
                query: evt.target.value
              });
              onChange(evt.target.value);
            }
          }
        />
        <div
          ref={(elem) => { this.suggest = elem; }}
          className={styles.suggest}
        >
          {
            items
              .map(item =>
                <IconButton
                  key={item.id}
                  item={item}
                  onClick={
                    item => onSelect(item)
                  }
                  type="add"
                />
              )
          }
        </div>
      </TetherComponent>
    );
  }
}

Suggest.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
};

export default Suggest;
