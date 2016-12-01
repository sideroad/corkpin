import React, { PropTypes } from 'react';
import __ from 'lodash';

const styles = require('../css/icon-button.less');

const IconButton = ({ item, onClick, type }) =>
  <button
    className={styles.item}
    key={item.id}
    onClick={
      () => onClick(item)
    }
  >
    <img className={styles.icon} alt={item.name} src={item.image} />
    <div className={styles.text} >{item.name}</div>
    <div className={styles[type]} >
      <i className={`fa ${type === 'add' ? 'fa-plus' : 'fa-trash'}`} />
      <div className={styles[`${type}Text`]} >{__.upperFirst(type)}</div>
    </div>
  </button>;

IconButton.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['add', 'delete'])
};

export default IconButton;
