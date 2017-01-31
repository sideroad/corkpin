import React, { PropTypes } from 'react';

const styles = require('../css/background.less');

const Cover = ({ image, video, children }) =>
  <div
    className={styles.background}
  >
    <div
      style={{
        backgroundImage: image ? `url(${image})` : 'none',
      }}
      className={`${styles.wrap} ${image ? styles.image : ''}`}
    >
      {
        video ?
          <video
            className={styles.video}
            muted
            loop
            autoPlay
          >
            <source src={video} />
          </video>
        : null
      }
    </div>
    {children}
  </div>;

Cover.propTypes = {
  image: PropTypes.string,
  video: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default Cover;
