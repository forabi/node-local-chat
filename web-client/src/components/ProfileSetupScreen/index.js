import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './style.css';
import { setUserData } from '../../actionCreators';
import Dropzone from 'react-dropzone';
import placeholderURL from '!!file!./default-avatar.svg';
import toBuffer from 'blob-to-buffer';
import { fromCallback } from 'bluebird';

class ProfileSetupScreen extends PureComponent {
  static propTypes = {
    // @TODO
    dispatch: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      name: '',
      picture: null,
    };
  }

  async onImageDrop(files) {
    this.setState(state => ({
      ...state,
      picture: files[0],
    }));
    // @TODO: handle image upload
  }

  async updateProfile() {
    const data = { ...this.state };
    if (data.picture) {
      data.picture = await fromCallback(cb => toBuffer(data.picture, cb));
    }
    this.props.dispatch(setUserData(data));
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h2>Welcome to LocalChat!</h2>
        </div>
        <Dropzone
          className={styles.dropzone}
          accept="image/png; image/jpg"
          onDrop={::this.onImageDrop}
        >
          <div
            className={styles.preview_text}
            style={this.state.picture ? { visibility: 'hidden' } : null}
          >
            Drop a profile picture here or click to choose one
          </div>
          <img
            className={styles.preview}
            src={this.state.picture ? this.state.picture.preview : placeholderURL}
            alt="Preview"
          />
        </Dropzone>
        <form className={styles.name}>
          <TextField
            className={styles.input_name}
            ref="name" placeholder="Your name"
            onChange={e => {
              this.setState(state => ({ ...state, name: e.target.value }));
              e.persist();
            }}
          />
          <RaisedButton
            className={styles.button_next}
            primary label="Next"
            onClick={::this.updateProfile}
          />
        </form>
      </div>
    );
  }
}
export default connect()(ProfileSetupScreen);