import React, { useContext } from 'react';
import { useMutation } from 'react-apollo';
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

const ProfilePage = () => {
  const { user, refreshUser } = useContext(UserContext);
  const [uploadFile] = useMutation(AvatarUploadMutation);
  let pond;

  const processUpload = (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort
  ) => {
    const controller = new AbortController();
    uploadFile({ variables: { file } })
      .then(data => load(data))
      .catch(err => error(err));

    return {
      abort: () => {
        controller.abort();
        abort();
      }
    };
  };

  const handleUploadComplete = () => {
    setTimeout(() => {
      pond.removeFiles();
      refreshUser();
    }, 1000);
  };

  return (
    <Page>
      <h1>{`${user.name}'s`} Profile</h1>
      <FilePond
        name="avatar"
        ref={ref => (pond = ref)}
        server={{ process: processUpload }}
        allowRevert={false}
        imageTransformOutputMimeType="image/jpeg"
        imageCropAspectRatio="1:1"
        imageResizeTargetWidth="300"
        onprocessfile={handleUploadComplete}
      />
      <img src={user.avatar} />
    </Page>
  );
};

export default withAuthGuard(ProfilePage);
