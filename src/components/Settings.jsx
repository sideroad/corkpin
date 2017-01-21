import React, { PropTypes, Component } from 'react';
import __ from 'lodash';
import { Button, Input, Chips } from 'koiki-ui';
import Selector from '../components/Selector';
import Modal from '../components/Modal';

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
          <dt>Title</dt>
          <dd>
            <Input
              className={styles.title}
              key="board-name"
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
            <Chips
              className={styles.chips}
              icon="fa-users"
              placeholder="Search and enter to allow users"
              onChange={
                query => onSearchUser(query)
              }
              onBlur={
                () => onBlurUser()
              }
              suggests={
                users.filter(user => !__.find(allows, { id: user.id }))
              }
              onSelect={
                user => onAddUser(user.id)
              }
              onDelete={
                user => onDeleteUser(user.id)
              }
              chips={
                allows
                  .filter(user => user.id !== userId)
              }
            />
          </dd>
          <dt>Danger zone</dt>
          <dd className={styles.dangerZone}>
            <Input
              key="danger-text"
              icon="fa-trash"
              value={this.state.deleteApp}
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
              disabled={this.state.deleteApp !== name}
              className={styles.delete}
              onClick={
                () => {
                  if (this.state.deleteApp === name) {
                    onDeleteBoard();
                  }
                }
              }
              text="Delete Board"
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
