import React, { Component } from 'react';
import { NextAuth } from 'next-auth/client';

import withAuthGuard from '../util/withAuthGuard';
import Page from '../layouts/Main';
import UserContext from '../util/UserContext';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

class ProfilePage extends Component {
  static displayName = 'ProfilePage';
  static contextType = UserContext;

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
        <FilePond name="avatar" server={serverOptions} />
        <img src={user.avatar} />
      </Page>
    );
  }
}

export default withAuthGuard(ProfilePage);
