import React, { PropTypes } from 'react';
import __ from 'lodash';
import Input from '../components/Input';
import Selector from '../components/Selector';
import Suggest from '../components/Suggest';
import IconButton from '../components/IconButton';

const styles = require('../css/settings.less');

// TODO: Be able to add images/videos, Delete images/videos
const Settings = ({
  userId,
  display,
  name,
  background,
  backgrounds,
  allows,
  onSearchUser,
  onBlurUser,
  users,
  onChangeBoardName,
  onChangeBoardBackground,
  onAddUser,
  onDeleteUser,
  onClose
}) =>
  <div
    className={`${styles.settings} ${display ? styles.show : styles.hide}`}
  >
    <button
      className={styles.close}
      onClick={
        () => onClose()
      }
    >
      <i className="fa fa-eject" />
    </button>
    <dl>
      <dt>Name</dt>
      <dd>
        <Input
          icon="fa-sticky-note"
          value={name}
          onBlur={
            evt => onChangeBoardName(evt.target.value)
          }
        />
      </dd>
      <dt>Background Image</dt>
      <dd>
        <Selector
          selected={background.id}
          items={backgrounds.map(background => ({
            ...background,
            image: `/images/bg-${background.id}.jpg`
          }))}
          onSelect={onChangeBoardBackground}
        />
      </dd>
      <dt>People who can see this board</dt>
      <dd>
        <Suggest
          onChange={
            query => onSearchUser(query)
          }
          onBlur={
            () => onBlurUser()
          }
          items={
            users
              .filter(user => !__.find(allows, { id: user.id }))
          }
          onSelect={
            user => onAddUser(user.id)
          }
        />
        <div className={styles.allowedUsers}>
          {
            allows
              .filter(user => user.id !== userId)
              .map(user =>
                <IconButton
                  key={user.id}
                  item={user}
                  onClick={
                    user => onDeleteUser(user.id)
                  }
                  type="delete"
                />
              )
          }
        </div>
      </dd>
    </dl>
  </div>;

Settings.propTypes = {
  userId: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  background: PropTypes.object.isRequired,
  backgrounds: PropTypes.array.isRequired,
  allows: PropTypes.array.isRequired,
  onSearchUser: PropTypes.func.isRequired,
  onBlurUser: PropTypes.func.isRequired,
  onChangeBoardName: PropTypes.func.isRequired,
  onChangeBoardBackground: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

export default Settings;
