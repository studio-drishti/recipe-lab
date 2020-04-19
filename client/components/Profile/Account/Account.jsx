import React, { useContext, useState, useRef, useEffect } from 'react';
import { useMutation } from 'react-apollo';
import isEmail from 'validator/lib/isEmail';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import AvatarUploadMutation from '../../../graphql/AvatarUploadMutation.graphql';
import AvatarDeleteMutation from '../../../graphql/AvatarDeleteMutation.graphql';
import UpdateUserMutation from '../../../graphql/UpdateUserMutation.graphql';
import FormInput from '../../FormInput';
import FormButton from '../../FormButton';
// import UserContext from '../../../context/UserContext';
import ChefContext from '../../../context/ChefContext';
import css from './Account.module.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const Account = () => {
  const { chef, refreshChef } = useContext(ChefContext);
  // const { user } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({});
  const [acceptedConsequences, setAcceptedConsequences] = useState(false);
  const [uploadAvatar] = useMutation(AvatarUploadMutation);
  const [deleteAvatar] = useMutation(AvatarDeleteMutation);
  const [
    updateUser,
    { loading: isSaving, error: hasError, called: wasSubmitted },
  ] = useMutation(UpdateUserMutation);
  const validationTimeouts = useRef({});
  const pond = useRef();
  // const isProfileOwner = user.id === chef.id;
  // const isAdmin = user.role === 'EXECUTIVE_CHEF';

  const getChefValue = (fieldName) => {
    if (edits[fieldName] !== undefined) return edits[fieldName];
    if (['password', 'passwordMatch'].includes(fieldName)) return '';
    return chef[fieldName];
  };

  const validate = (fieldName, value) => {
    let err = undefined;

    switch (fieldName) {
      case 'name':
        if (value.length < 1 || value.length > 125)
          err = 'Your display name must be between 1 and 125 characters';
        break;
      case 'bio':
        if (value && value.length > 300)
          err = 'Your bio must be less than 300 characters';
        break;
      case 'slug':
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          err =
            'Your username must only contain lowercase letters, numbers and/or single dashes';
        } else if (value !== chef.slug && !acceptedConsequences) {
          err = 'You must accept the consequences of changing your username.';
        }
        break;
      case 'email':
        if (!isEmail(value)) err = 'Please enter a valid email address';
        break;
      case 'password':
        if (value && (value.length < 8 || value.length > 125)) {
          err = 'Password must be between 8 and 125 characters';
        }
        break;
      case 'passwordMatch':
        if (edits.password && !value) {
          err = 'Please verify your password';
        } else if (edits.password && value !== edits.password) {
          err = 'Passwords do not match';
        }
        break;
    }

    setErrors((errors) => ({
      ...errors,
      [fieldName]: err,
    }));

    return Boolean(!err);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (validationTimeouts.current[name])
      clearTimeout(validationTimeouts.current[name]);

    setEdits({
      ...edits,
      [name]: value,
    });

    validationTimeouts.current[name] = setTimeout(() => {
      validate(name, value);
      delete validationTimeouts.current[name];
    }, 1000);
  };

  const resetUsername = (e) => {
    e.preventDefault();
    if (validationTimeouts.current.slug) {
      clearTimeout(validationTimeouts.current.slug);
      delete validationTimeouts.current.slug;
    }
    setErrors({ ...errors, slug: undefined });
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
    uploadAvatar({ variables: { file, userId: chef.id } })
      .then(({ data }) => {
        load();
        refreshChef(data.avatarUpload);
      })
      .catch((err) => error(err));

    return {
      abort: () => {
        controller.abort();
        abort();
      },
    };
  };

  const handleAvatarDelete = (e) => {
    e.preventDefault();
    deleteAvatar({ variables: { userId: chef.id } }).then(({ data }) =>
      refreshChef(data.deleteAvatar)
    );
  };

  const handleUploadComplete = () => {
    setTimeout(() => {
      if (pond.current) pond.current.removeFiles();
    }, 1000);
  };

  const saveChef = (e) => {
    e.preventDefault();
    const editEntries = Object.entries(edits);
    if (editEntries.length === 0) return;

    if (edits.password && typeof edits.passwordMatch === 'undefined')
      editEntries.push(['passwordMatch', '']);

    const haveErrors = editEntries.filter(
      ([key, value]) => !validate(key, value)
    );

    if (haveErrors.length === 0) {
      const variables = {
        userId: chef.id,
        name: getChefValue('name'),
        bio: getChefValue('bio'),
        email: getChefValue('email'),
        slug: getChefValue('slug'),
      };

      if (edits.password) {
        variables.password = edits.password;
      }

      updateUser({ variables }).then(({ data }) => {
        refreshChef(data.updateUser);
        setEdits({});
      });
    }
  };

  useEffect(() => {
    if (!edits.slug) return;
    if (validationTimeouts.current.slug) {
      clearTimeout(validationTimeouts.current.slug);
      delete validationTimeouts.current.slug;
    }
    validate('slug', edits.slug);
  }, [acceptedConsequences]);

  return (
    <form onSubmit={saveChef}>
      <h2>Chef Details</h2>
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
      {!chef.avatar.startsWith('/static/placeholder') && (
        <p>
          <a href="#" onClick={handleAvatarDelete}>
            Remove Avatar
          </a>
        </p>
      )}
      <FormInput
        required
        name="name"
        label="Display Name"
        onChange={handleFormChange}
        value={getChefValue('name')}
        error={errors.name}
      />
      <FormInput
        type="textarea"
        name="bio"
        label="Bio"
        onChange={handleFormChange}
        value={getChefValue('bio')}
        error={errors.bio}
      />
      <FormInput
        required
        name="slug"
        label="User Name"
        onChange={handleFormChange}
        value={getChefValue('slug')}
        error={errors.slug}
      />
      {edits.slug !== undefined && edits.slug !== chef.slug && (
        <>
          <p>
            Changing your user name will rewrite all of your recipe URLs. Which
            may <strong>make them difficult to find</strong>. Consider changing
            your display name instead.
          </p>
          <p>
            My bad!{' '}
            <a href="#" onClick={resetUsername}>
              Click here to keep your user name
            </a>
            .
          </p>
          <p>
            <input
              type="checkbox"
              checked={acceptedConsequences}
              onChange={() => setAcceptedConsequences(!acceptedConsequences)}
            />{' '}
            I&apos;m aware of the consequences. Please change my username.
            KTHNXBAI!
          </p>
        </>
      )}
      <FormInput
        required
        name="email"
        label="Email"
        onChange={handleFormChange}
        value={getChefValue('email')}
        error={errors.email}
      />
      <div className={css.twoFields}>
        <FormInput
          type="password"
          name="password"
          label="Password"
          onChange={handleFormChange}
          value={getChefValue('password')}
          error={errors.password}
        />
        <FormInput
          type="password"
          name="passwordMatch"
          label="Match Password"
          onChange={handleFormChange}
          value={getChefValue('passwordMatch')}
          error={errors.passwordMatch}
        />
      </div>

      {isSaving && <p>Saving, please wait...</p>}

      {hasError && <p>Oh no! Something went wrong.</p>}

      {!isSaving && !hasError && wasSubmitted && <p>Save successful!</p>}

      <FormButton disabled={isSaving}>Save</FormButton>

      <h2>Account Deletion</h2>
      <p>
        <a href="#">Delete my account</a>
      </p>
    </form>
  );
};

export default Account;
