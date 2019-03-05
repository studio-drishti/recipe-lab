import React, { Component } from 'react';

import withAuthGuard from '../utils/withAuthGuard';
import Page from '../layouts/Main';
import UserContext from '../utils/UserContext';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

class ProfilePage extends Component {
  static displayName = 'ProfilePage';
  static contextType = UserContext;

  handleUploadComplete = () => {
    setTimeout(() => {
      this.pond.removeFiles();
    }, 1000);
    this.context.refreshUser();
  };

  render() {
    const { user, csrfToken } = this.context;

    const serverOptions = {
      url: '/api/avatars',
      process: {
        url: '/upload',
        ondata: formData => {
          formData.append('_csrf', csrfToken);
          return formData;
        }
      }
    };

    return (
      <Page>
        <h1>{`${user.name}'s`} Profile</h1>
        <FilePond
          name="avatar"
          ref={ref => (this.pond = ref)}
          server={serverOptions}
          allowRevert={false}
          imageTransformOutputMimeType="image/jpeg"
          imageCropAspectRatio="1:1"
          imageResizeTargetWidth="300"
          onprocessfile={this.handleUploadComplete}
        />
        <img src={user.avatar} />
      </Page>
    );
  }
}

export default withAuthGuard(ProfilePage);
