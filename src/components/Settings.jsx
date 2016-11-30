import React, { PropTypes } from 'react';
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
        <TetherComponent
          attachment="top left"
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
                  <img className={styles.icon} alt={user.name} src={user.image} />
                  <div className={styles.text} >{user.name}</div>
                  <div className={styles.add} >
                    <i className="fa fa-plus" />
                    <div className={styles.addText} >Add</div>
                  </div>
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
                  <img className={styles.icon} alt={user.name} src={user.image} />
                  <div className={styles.text} >{user.name}</div>
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
  onChangeBoardBackground: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

export default Settings;
