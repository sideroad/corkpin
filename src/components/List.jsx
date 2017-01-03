import React, { PropTypes } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

const styles = require('../css/list.less');

const List = ({ className, hover, theme, position, items, onClick, onReachToBottom }) =>
  <ul className={`${styles.list} ${styles[hover]} ${styles[theme]} ${styles[position]} ${className}`} >
    {
      items.map(item =>
        <li
          key={item.id}
          className={styles.item}
        >
          <button
            className={`${styles.link} ${item.selected ? styles.selected : ''}`}
            onClick={(evt) => {
              evt.preventDefault();
              onClick(item, !item.selected);
            }}
          >
            <div
              className={styles.back}
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div
              className={`${styles.outline} ${item.name ? '' : styles.none}`}
            />
            {
              item.name ? <div className={styles.text} >{item.name}</div> : ''
            }
          </button>
        </li>
      )
    }
    <li>
      <VisibilitySensor
        onChange={
          (isVisible) => {
            if (isVisible) {
              onReachToBottom();
            }
          }
        }
      />
    </li>
  </ul>;

List.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  hover: PropTypes.oneOf(['unveil', 'cover']).isRequired,
  theme: PropTypes.oneOf(['classic', 'pop']).isRequired,
  position: PropTypes.oneOf(['top', 'middle', 'bottom']).isRequired,
  onClick: PropTypes.func.isRequired,
  onReachToBottom: PropTypes.func.isRequired
};

List.defaultProps = {
  className: '',
  items: [],
  onClick: evt => evt.preventDefault(),
  hover: 'unveil',
  theme: 'classic',
  position: 'middle',
  onReachToBottom: () => {}
};

export default List;
