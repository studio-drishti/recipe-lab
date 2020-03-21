import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useMutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import RecipePhotoUploadMutation from '../../graphql/RecipePhotoUpload.graphql';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import { setRecipePhoto } from '../../actions/recipe';

import css from './RecipePhoto.module.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const RecipePhoto = ({ placeholderPhoto, className }) => {
  const [uploadFile] = useMutation(RecipePhotoUploadMutation);
  const { user } = useContext(UserContext);
  const { recipe, recipeDispatch } = useContext(RecipeContext);
  let pond;

  const canUploadPhoto = Boolean(
    recipe &&
      user &&
      (user.id === recipe.author.id || user.role === 'EXECUTIVE_CHEF')
  );

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
    uploadFile({
      variables: {
        file,
        recipeId: recipe.uid
      },
      context: {
        fetchOptions: {
          signal: controller.signal
        }
      }
    })
      .then(res => {
        setRecipePhoto(res.data.recipePhotoUpload.photo, recipeDispatch);
        load(res);
      })
      .catch(err => error(err));

    return {
      abort: () => {
        controller.abort();
        abort();
      }
    };
  };

  const handleUploadComplete = (err, file) => {
    setTimeout(() => {
      pond.removeFile(file);
    }, 1000);
  };

  return (
    <div className={classnames(css.recipePhoto, className)}>
      <img src={recipe && recipe.photo ? recipe.photo : placeholderPhoto} />
      {canUploadPhoto && (
        <FilePond
          name="avatar"
          ref={ref => (pond = ref)}
          className={css.filepond}
          server={{ process: processUpload }}
          allowRevert={false}
          allowMultiple={false}
          imageTransformOutputMimeType="image/jpeg"
          imageCropAspectRatio="3:2"
          imageResizeTargetWidth="600"
          onprocessfile={handleUploadComplete}
        />
      )}
    </div>
  );
};

RecipePhoto.propTypes = {
  className: PropTypes.string,
  placeholderPhoto: PropTypes.string
};

export default RecipePhoto;
