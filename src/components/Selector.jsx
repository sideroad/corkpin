import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { Cards } from 'koiki-ui';
import __ from 'lodash';

const styles = require('../css/selector.less');

// eslint-disable-next-line react/prefer-stateless-function
class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { selected, items, onSelect } = this.props;
    const { isOpen } = this.state;
    const onClose = () => {
      this.setState({
        isOpen: false
      });
    };
    const onOpen = () => {
      this.setState({
        isOpen: true
      });
    };
    return (
      <div
        className={styles.selector}
      >
        <button
          className={styles.selected}
          onClick={onOpen}
        >
          <img className={styles.icon} alt={selected} src={`/images/bg-${selected}.jpg`} />
          <div className={styles.text} >{__.upperFirst(selected)}</div>
        </button>
        <Modal
          isOpen
          onRequestClose={onClose}
          className={`${styles.modal} ${isOpen ? styles.show : styles.hide}`}
          overlayClassName={`${styles.overlay} ${isOpen ? styles.showOverlay : styles.hideOverlay}`}
        >
          <Cards
            items={items.map(item => ({ ...item, title: item.name }))}
            theme="pop"
            hover="cover"
            position="middle"
            onClick={
              (item) => {
                onSelect(item);
                this.setState({
                  isOpen: false
                });
              }
            }
          />
        </Modal>
      </div>
    );
  }
}

Selector.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default Selector;
