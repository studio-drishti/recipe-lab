import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import UserContext from '../../utils/UserContext';
import AvatarUploadMutation from '../../graphql/AvatarUpload.graphql';

import css from './ProfileHeader.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const ProfileHeader = ({ chef }) => {
  const { user, refreshUser } = useContext(UserContext);
  const [uploadFile] = useMutation(AvatarUploadMutation);
  let pond;

  const isProfileOwner = user.id === chef.id;
  // const isAdmin = user.role === 'EXECUTIVE_CHEF';

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
    <header className={css.profileHeader}>
      <div>
        {chef.avatar ? (
          <img src={chef.avatar} />
        ) : (
          <img src="https://loremflickr.com/300/300/cook" />
        )}
        {isProfileOwner && (
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
        )}
      </div>
      <div>
        <h1>{`${chef.name}'s`} Profile</h1>
      </div>
      <div>
        <ul>
          <li>xx recipes</li>
          <li>xx mods</li>
          <li>xx followers</li>
        </ul>
      </div>
    </header>
  );
};

ProfileHeader.propTypes = {
  chef: PropTypes.object
};

export default ProfileHeader;
