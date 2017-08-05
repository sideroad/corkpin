import React, { PropTypes, Component } from 'react';
import __ from 'lodash';
import { Button, Input, Chips, Selectbox } from 'koiki-ui';
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
      font,
      fonts,
      background,
      backgrounds,
      allows,
      onSearchUser,
      users,
      onChangeBoardName,
      onChangeBoardBackground,
      onChangeBoardFont,
      onAddUser,
      onDeleteUser,
      onClose,
      onDeleteBoard
    } = this.props;
    return (
      <Modal
        contentLabel="settings"
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
            <Selectbox
              selected={{
                ...background,
                value: background.id,
                text: background.id,
                image: `/images/bg-${background.id}.jpg`,
              }}
              options={backgrounds.map(background => ({
                ...background,
                value: background.id,
                text: background.id,
                image: `/images/bg-${background.id}.jpg`
              }))}
              onSelect={onChangeBoardBackground}
            />
          </dd>
          <dt>Font family</dt>
          <dd>
            <Selectbox
              selected={{
                ...font,
                value: font.code,
                text: font.name
              }}
              options={fonts.map(font => ({
                ...font,
                value: font.code,
                text: font.name
              }))}
              onSelect={onChangeBoardFont}
            />
          </dd>
          <dt>People who can see this board</dt>
          <dd>
            <Chips
              className={styles.chips}
              icon="fa-users"
              placeholder="Search and select to add user"
              onChange={
                evt => onSearchUser(evt.target.value)
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
  font: PropTypes.object.isRequired,
  fonts: PropTypes.array.isRequired,
  background: PropTypes.object.isRequired,
  backgrounds: PropTypes.array.isRequired,
  allows: PropTypes.array.isRequired,
  onSearchUser: PropTypes.func.isRequired,
  onChangeBoardName: PropTypes.func.isRequired,
  onChangeBoardBackground: PropTypes.func.isRequired,
  onChangeBoardFont: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  onDeleteBoard: PropTypes.func.isRequired
};

export default Settings;
