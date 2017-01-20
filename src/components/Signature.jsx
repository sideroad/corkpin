import React, { PropTypes } from 'react';
import { Button, InputtableButton } from 'koiki-ui';

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
            text={props.find}
            placeholder={props.find}
            focused={props.type === 'finding'}
            progress={props.loadingBoards ? 'loading' : 'none'}
          />
        : ''
      }
      {
        props.create ?
          <Button
            icon="fa-paint-brush"
            onClick={props.onClickCreate}
            text={props.create}
            className={styles.create}
          />
        : ''
      }
      {
        props.start ?
          <Button
            icon="fa-sign-in"
            onClick={props.onClickStart}
            text={props.start}
            className={styles.create}
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
  onChangeFind: PropTypes.func,
  loadingBoards: PropTypes.bool
};

export default Signature;
