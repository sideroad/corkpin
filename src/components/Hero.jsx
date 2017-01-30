import React, { PropTypes } from 'react';

const styles = require('../css/hero.less');

const Hero = props =>
  <div
    className={`
      ${styles.hero}
      ${styles[props.color]}
      ${styles[props.position]}
    `}
  >
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${props.image})`
      }}
    />
    <div className={styles.contents} >
      <h1 className={styles.lead}>
        {props.lead}
      </h1>
      <div className={styles.description}>
        {props.description}
      </div>
    </div>
  </div>;

Hero.propTypes = {
  lead: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'pink', 'yellow']),
  position: PropTypes.oneOf(['left', 'right']),
};

Hero.defaultProps = {
  color: 'blue',
  position: 'left',
};

export default Hero;
