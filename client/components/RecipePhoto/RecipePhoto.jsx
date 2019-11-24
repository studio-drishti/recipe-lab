import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useMutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import RecipePhotoUploadMutation from '../../graphql/RecipePhotoUpload.graphql';
import UserContext from '../../utils/UserContext';

import css from './RecipePhoto.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const RecipePhoto = ({ recipe, setRecipePhoto, className }) => {
  const [uploadFile] = useMutation(RecipePhotoUploadMutation);
  const { user } = useContext(UserContext);
  let pond;

  const canUploadPhoto = Boolean(
    recipe &&
      ((user && user.id === recipe.author.id) || user.role === 'EXECUTIVE_CHEF')
  );

  const randomPlaceholder = useMemo(() => {
    const rand = Math.floor(Math.random() * 3 + 1);
    return `/static/placeholders/recipe-${rand}.jpg`;
  }, [recipe]);

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
        setRecipePhoto(res.data.recipePhotoUpload.photo);
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
      {recipe && recipe.photo ? (
        <img src={recipe.photo} />
      ) : (
        <img src={randomPlaceholder} />
      )}
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
  setRecipePhoto: PropTypes.func,
  recipe: PropTypes.object,
  className: PropTypes.string,
  updatePhoto: PropTypes.func
};

export default RecipePhoto;
