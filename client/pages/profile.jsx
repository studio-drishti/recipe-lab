import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import withAuthGuard from '../utils/withAuthGuard';
import Page from '../layouts/Main';
import UserContext from '../utils/UserContext';
import AvatarUploadMutation from '../graphql/AvatarUpload.graphql';

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
    const { user } = this.context;

    return (
      <Page>
        <h1>{`${user.name}'s`} Profile</h1>
        <Mutation mutation={AvatarUploadMutation}>
          {uploadFile => (
            <FilePond
              name="avatar"
              ref={ref => (this.pond = ref)}
              server={{
                process: (
                  fieldName,
                  file,
                  metadata,
                  load,
                  error,
                  progress,
                  abort
                ) => {
                  uploadFile({ variables: { file } })
                    .then(data => load(data))
                    .catch(err => error(err));

                  return {
                    abort: () => {
                      abort();
                    }
                  };
                }
              }}
              allowRevert={false}
              imageTransformOutputMimeType="image/jpeg"
              imageCropAspectRatio="1:1"
              imageResizeTargetWidth="300"
              onprocessfile={this.handleUploadComplete}
            />
          )}
        </Mutation>
        <img src={user.avatar} />
      </Page>
    );
  }
}

export default withAuthGuard(ProfilePage);
