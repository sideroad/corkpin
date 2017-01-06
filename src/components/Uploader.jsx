import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import Modal from '../components/Modal';

const styles = require('../css/uploader.less');


// TODO: Add waiting images
const Uploader = ({
  display,
  onClose,
  lead,
  onUploaded
}) =>
  <Modal
    display={display}
    onClose={onClose}
  >
    <div className={styles.selector}>
      <div className={styles.lead}>{lead}</div>
      <Dropzone
        className={styles.dropzone}
        onDrop={(files) => {
          const req = request.post('/upload/files');
          files.forEach(file => req.attach('files', file));
          req.end((err, res) => onUploaded(err, res));
        }}
      >
        <div>
          <i className={`fa fa-file-image-o ${styles.dropicon}`} />
        </div>
      </Dropzone>
    </div>
  </Modal>;

Uploader.propTypes = {
  lead: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUploaded: PropTypes.func.isRequired
};

export default Uploader;
