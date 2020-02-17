import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import UserContext from '../../../context/UserContext';
import AvatarUploadMutation from '../../../graphql/AvatarUpload.graphql';

import css from './Header.css';

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

  const chefTitle = useCallback(() => {
    switch (chef.role) {
      case 'EXECUTIVE_CHEF':
        return 'Executive Chef';
      case 'SOUS_CHEF':
        return 'Sous Chef';
      case 'COMMIS_CHEF':
        return 'Commis Chef';
      default:
        return 'Kitchen Porter';
    }
  }, [chef.role]);

  return (
    <header className={css.profileHeader}>
      <div className={css.profilePhoto}>
        {chef.avatar ? (
          <img src={chef.avatar} />
        ) : (
          <img src="https://loremflickr.com/300/300/cook" />
        )}

        {isProfileOwner && (
          <FilePond
            className={css.filepond}
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
        <h1>{chef.name}</h1>
        <h3>{chefTitle()}</h3>
        <p>
          Donec rhoncus neque vel nisl laoreet dictum. Curabitur porttitor arcu
          sit amet diam pharetra tempor nec vitae lectus. Pellentesque accumsan
          condimentum lobortis.
        </p>
      </div>
      <div>
        <ul>
          <li>
            {chef.recipeCount}
            recipe{chef.recipeCount > 1 && 's'}
          </li>
          <li>
            {chef.modifiedRecipeCount}
            modified recipe{chef.modifiedRecipeCount > 1 && 's'}
          </li>
        </ul>
      </div>
    </header>
  );
};

ProfileHeader.propTypes = {
  chef: PropTypes.object
};

export default ProfileHeader;
