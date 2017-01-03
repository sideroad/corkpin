import React, { PropTypes, Component } from 'react';
import __ from 'lodash';
import Input from '../components/Input';
import Selector from '../components/Selector';
import Suggest from '../components/Suggest';
import IconButton from '../components/IconButton';
import Modal from '../components/Modal';
import Button from '../components/Button';

const styles = require('../css/settings.less');

// eslint-disable-next-line react/prefer-stateless-function
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteApp: '',
    };
  }

  render() {
    const {
      display,
      userId,
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
      onClose,
      onDeleteBoard
    } = this.props;
    return (
      <Modal
        display={display}
        className={styles.settings}
        onClose={onClose}
      >
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
          <dt>Danger zone</dt>
          <dd className={styles.dangerZone}>
            <Input
              icon="fa-trash"
              value=""
              className={styles.deleteApp}
              placeholder="Enter board name and click to delete board"
              onChange={
                (evt) => {
                  this.setState({
                    deleteApp: evt.target.value
                  });
                }
              }
            />
            <Button
              icon="fa-trash"
              className={styles.delete}
              onClick={
                () => {
                  if (this.state.deleteApp === name) {
                    onDeleteBoard();
                  }
                }
              }
              button="Delete Board"
            />
          </dd>
        </dl>
      </Modal>
    );
  }
}

Settings.propTypes = {
  display: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
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
  users: PropTypes.array.isRequired,
  onDeleteBoard: PropTypes.func.isRequired
};

export default Settings;
