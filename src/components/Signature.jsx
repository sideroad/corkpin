import React, { PropTypes } from 'react';
import InputtableButton from '../components/InputtableButton';
import Button from '../components/Button';

const styles = require('../css/signature.less');

const Signature = props =>
  <section
    className={`${styles.signature} ${styles[props.type]}`}
  >
    <h1 className={styles.lead} >{props.lead}</h1>
    <div className={styles.control}>
      {
        props.find ?
          <InputtableButton
            icon="fa-search"
            className={styles.find}
            onClick={props.onClickFind}
            onChange={props.onChangeFind}
            button={props.find}
            placeholder={props.find}
            clicked={props.type === 'finding'}
            escaped={props.type !== 'finding'}
          />
        : ''
      }
      {
        props.create ?
          <Button
            icon="fa-paint-brush"
            className={styles.create}
            onClick={props.onClickCreate}
            button={props.create}
            clicked={props.type === 'creating'}
            escaped={props.type !== 'creating'}
          />
        : ''
      }
      {
        props.start ?
          <Button
            icon="fa-sign-in"
            className={styles.start}
            onClick={props.onClickStart}
            button={props.start}
            clicked={props.type === 'starting'}
            escaped={props.type !== 'starting'}
          />
        : ''
      }
    </div>
  </section>;

Signature.propTypes = {
  type: PropTypes.oneOf(['starting', 'finding', 'creating']),
  lead: PropTypes.string.isRequired,
  find: PropTypes.string,
  create: PropTypes.string,
  start: PropTypes.string,
  onClickFind: PropTypes.func,
  onClickCreate: PropTypes.func,
  onClickStart: PropTypes.func,
  onChangeFind: PropTypes.func
};

export default Signature;
