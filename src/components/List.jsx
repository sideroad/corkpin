import React, { PropTypes } from 'react';

const styles = require('../css/list.less');

const List = ({ hover, theme, position, items, onClick }) =>
  <ul className={`${styles.list} ${styles[hover]} ${styles[theme]} ${styles[position]}`} >
    {
      items.map(item =>
        <li
          key={item.id}
          className={styles.item}
        >
          <a
            className={styles.link}
            href="/"
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
          </a>
        </li>
      )
    }
  </ul>;

List.propTypes = {
  items: PropTypes.array.isRequired,
  hover: PropTypes.oneOf(['unveil', 'cover']).isRequired,
  theme: PropTypes.oneOf(['classic', 'pop']).isRequired,
  position: PropTypes.oneOf(['top', 'middle', 'bottom']).isRequired,
  onClick: PropTypes.func.isRequired
};

List.defaultProps = {
  items: [],
  onClick: evt => evt.preventDefault(),
  hover: 'unveil',
  theme: 'classic',
  position: 'middle'
};

export default List;
