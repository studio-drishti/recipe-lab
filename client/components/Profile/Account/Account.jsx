import React, { useContext, useState, useRef } from 'react';
import { useMutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import AvatarUploadMutation from '../../../graphql/AvatarUpload.graphql';
import FormInput from '../../FormInput';
import UserContext from '../../../context/UserContext';
import ChefContext from '../../../context/ChefContext';
import css from './Account.module.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const Account = () => {
  const { chef, refreshChef } = useContext(ChefContext);
  const { user, refreshUser } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({});
  const [uploadFile] = useMutation(AvatarUploadMutation);
  const pond = useRef();
  const isProfileOwner = user.id === chef.id;
  const isAdmin = user.role === 'EXECUTIVE_CHEF';

  const getChefValue = fieldName => {
    if (edits[fieldName] !== undefined) return edits[fieldName];
    return chef[fieldName];
  };

  const handleFormChange = e => {
    setEdits({ ...edits, [e.target.name]: e.target.value });
  };

  const resetUsername = e => {
    e.preventDefault();
    setEdits({ ...edits, slug: chef.slug });
  };

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
    refreshChef();
    setTimeout(() => {
      if (pond.current) pond.current.removeFiles();
    }, 1000);
  };

  return (
    <div>
      <p className={css.filepondLabel}>Profile Photo:</p>
      <FilePond
        className={css.filepond}
        name="avatar"
        ref={pond}
        server={{ process: processUpload }}
        allowRevert={false}
        imageTransformOutputMimeType="image/jpeg"
        imageCropAspectRatio="1:1"
        imageResizeTargetWidth="300"
        onprocessfiles={handleUploadComplete}
      />
      <FormInput
        name="name"
        label="Display Name"
        onChange={handleFormChange}
        value={getChefValue('name')}
      />
      <FormInput
        name="slug"
        label="User Name"
        onChange={handleFormChange}
        value={getChefValue('slug')}
      />
      {edits.slug !== undefined && edits.slug !== chef.slug && (
        <p>
          Changing your user name will rewrite all of your recipe URLs. Which
          may make them difficult to find. Consider changing your display name
          instead.{' '}
          <em>
            <a href="#" onClick={resetUsername}>
              My bad! Click here to keep your user name
            </a>
            .
          </em>
        </p>
      )}
      <FormInput
        type="textarea"
        name="bio"
        label="Bio"
        onChange={handleFormChange}
        value={getChefValue('bio')}
      />
      <p>
        <a href="#">Delete my account</a>
      </p>
    </div>
  );
};

export default Account;
