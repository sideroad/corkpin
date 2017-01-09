import React, { PropTypes } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

const styles = require('../css/list.less');

const List = ({
  className,
  hover,
  theme,
  position,
  items,
  onClick,
  onReachToBottom,
  nowrap,
  hasSpace
}) =>
  <ul className={`${styles.list} ${styles[hover]} ${styles[theme]} ${styles[position]} ${className} ${hasSpace ? styles.hasSpace : ''}`} >
    {
      items.map(item =>
        <li
          key={item.id}
          className={styles.item}
        >
          <button
            className={`${styles.link} ${item.selected ? styles.selected : ''} ${!onClick ? styles.unclickable : ''}`}
            onClick={(evt) => {
              evt.preventDefault();
              if (onClick) {
                onClick(item, !item.selected);
              }
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
              item.name ?
                <div
                  className={styles.text}
                  style={{
                    whiteSpace: nowrap ? 'nowrap' : ''
                  }}
                >{item.name}</div> : ''
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
  hasSpace: PropTypes.bool,
  onClick: PropTypes.func,
  onReachToBottom: PropTypes.func,
  nowrap: PropTypes.bool,
};

List.defaultProps = {
  className: '',
  items: [],
  clickable: true,
  hover: 'unveil',
  theme: 'classic',
  position: 'middle',
  nowrap: true,
  hasSpace: false,
  onReachToBottom: () => {}
};

export default List;
