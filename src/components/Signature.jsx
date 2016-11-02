import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import InputtableButton from '../components/InputtableButton';
import Button from '../components/Button';

const styles = require('../css/signature.less');

const Signature = props =>
  <section
    className={`${styles.signature} ${props.finding ? styles.finding :
                                      props.creating ? styles.creating : ''}`}
    onSubmit={props.handleSubmit}
  >
    <h1 className={styles.lead} >{props.creating ? props.findOnFacebook : props.lead}</h1>
    <div className={styles.control}>
      <InputtableButton
        icon="fa-search"
        className={styles.find}
        onClick={props.onClickFind}
        button={props.find}
        placeholder={props.find}
        clicked={props.finding}
        escaped={!props.finding}
      />
      <Button
        icon="fa-paint-brush"
        className={styles.create}
        onClick={props.onClickCreate}
        button={props.create}
        clicked={props.creating}
        escaped={!props.creating}
      />
    </div>
  </section>;

Signature.propTypes = {
  finding: PropTypes.bool,
  creating: PropTypes.bool,
  lead: PropTypes.string.isRequired,
  find: PropTypes.string.isRequired,
  create: PropTypes.string.isRequired,
  findOnFacebook: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClickFind: PropTypes.func,
  onClickCreate: PropTypes.func
};

export default reduxForm({
  form: 'find' // a unique name for this form
})(Signature);
