import React, { PropTypes } from 'react';
import __ from 'lodash';
import TetherComponent from 'react-tether';
import Input from '../components/Input';
import Selector from '../components/Selector';

const styles = require('../css/settings.less');

const Settings = ({
  userId,
  display,
  name,
  background,
  backgrounds,
  allows,
  onSearchUser,
  users,
  onChangeBoardName,
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
        <button
          className={styles.selected}
          onClick={
            // TODO: Open modal box to select bacground image
            () => {}
          }
        >
          <img className={styles.icon} alt={background.id} src={`/images/bg-${background.id}.jpg`} />
          <div className={styles.text} >{__.upperFirst(background.id)}</div>
        </button>
        <Selector
          selected={background.id}
          options={backgrounds}
        />
      </dd>
      <dt>People who can see this board</dt>
      <dd>
        <TetherComponent
          attachment="top center"
        >
          <Input
            icon={`fa-users ${styles.allowedUserIcon}`}
            value=""
            placeholder="Search and enter to allow users"
            onChange={
              evt => onSearchUser(evt.target.value)
            }
          />
          <div className={styles.suggest}>
            {
              users.map(user =>
                <button
                  className={styles.allowedUser}
                  key={user.id}
                  onClick={
                    () => onAddUser(user.id)
                  }
                >
                  <img className={styles.smallIcon} alt={user.name} src={user.image} />
                  <div className={styles.smallText} >{user.name}</div>
                </button>
              )
            }
          </div>
        </TetherComponent>
        <div className={styles.allowedUsers}>
          {
            allows
              .filter(user => user.id !== userId)
              .map(user =>
                <button
                  className={styles.allowedUser}
                  key={user.id}
                  onClick={
                    () => onDeleteUser(user.id)
                  }
                >
                  <img className={styles.smallIcon} alt={user.name} src={user.image} />
                  <div className={styles.smallText} >{user.name}</div>
                  <div className={styles.delete} >
                    <i className="fa fa-trash" />
                    <div className={styles.deleteText} >Delete</div>
                  </div>
                </button>
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
  onChangeBoardName: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

export default Settings;