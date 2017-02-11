import React, { PropTypes } from 'react';
import { stringify } from 'koiki';
import uris from '../uris';
import Header from '../components/Header';
import Cover from '../components/Cover';

const styles = require('../css/privacypolicy.less');

const PrivacyPolicy = (props, { i18n, lang }) =>
  <div>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Cover>
      <div className={styles.policy} >
        <header className={styles.header} >{i18n.privacy_policy}</header>
        <section className={styles.section} >
          <div className={styles.contents} >
            {i18n.privacy_policy_contents}
          </div>
          <header className={styles.subheader} >
            {i18n.information_collection}
          </header>
          <section className={styles.contents}>
            {i18n.information_collection_contents}
          </section>
          <header className={styles.subheader}>
            {i18n.other_information}
          </header>
          <section className={styles.contents}>
            {i18n.other_information_contents}
          </section>
        </section>
      </div>
    </Cover>
  </div>;

PrivacyPolicy.contextTypes = {
  i18n: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
};

export default PrivacyPolicy;
