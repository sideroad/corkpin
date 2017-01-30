import React, { PropTypes } from 'react';
import { Input } from 'koiki-ui';
import Modal from '../components/Modal';

const styles = require('../css/photo-settings.less');

const PhotoSettings = ({
      display,
      name,
      onChangePhotoName,
      onClose,
    }) =>
      <Modal
        display={display}
        className={styles.settings}
        onClose={onClose}
      >
        <dl>
          <dt>Title</dt>
          <dd>
            <Input
              key={name}
              icon="fa-sticky-note"
              value={name}
              onBlur={
                evt => onChangePhotoName(evt.target.value)
              }
            />
          </dd>
        </dl>
      </Modal>;

PhotoSettings.propTypes = {
  display: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onChangePhotoName: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PhotoSettings;