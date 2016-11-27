import React, { PropTypes } from 'react';

const styles = require('../css/list.less');

const List = ({ className, hover, theme, position, items, onClick }) =>
  <ul className={`${styles.list} ${styles[hover]} ${styles[theme]} ${styles[position]} ${className}`} >
    {
      items.map(item =>
        <li
          key={item.id}
          className={styles.item}
        >
          <button
            className={styles.link}
            onClick={(evt) => {
              evt.preventDefault();
              onClick(item);
            }}
          >
            <div
              className={styles.back}
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div
              className={styles.outline}
            />
            <div className={styles.text} >{item.name}</div>
          </button>
        </li>
      )
    }
  </ul>;

List.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  hover: PropTypes.oneOf(['unveil', 'cover']).isRequired,
  theme: PropTypes.oneOf(['classic', 'pop']).isRequired,
  position: PropTypes.oneOf(['top', 'middle', 'bottom']).isRequired,
  onClick: PropTypes.func.isRequired
};

List.defaultProps = {
  className: '',
  items: [],
  onClick: evt => evt.preventDefault(),
  hover: 'unveil',
  theme: 'classic',
  position: 'middle'
};

export default List;
