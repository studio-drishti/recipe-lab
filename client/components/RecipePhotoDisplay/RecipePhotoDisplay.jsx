import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import RecipePhotoUploadMutation from '../../graphql/RecipePhotoUpload.graphql';

import css from './RecipePhotoDisplay.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const RecipePhotoDisplay = ({ photo, addPhoto, recipeId, className }) => {
  const [uploadFile] = useMutation(RecipePhotoUploadMutation);
  let pond;
  const handleUploadComplete = (err, file) => {
    setTimeout(() => {
      pond.removeFile(file);
    }, 1000);
  };

  return (
    <div>
      {photo && (
        <div
          style={{ backgroundImage: `url(${photo.url})` }}
          className={css.slide}
        />
      )}
      <FilePond
        name="avatar"
        ref={ref => (pond = ref)}
        className={css.filepond}
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
            uploadFile({
              variables: {
                file,
                recipeId: recipeId
              }
            })
              .then(res => {
                addPhoto(res.data.recipePhotoUpload);
                load(res);
              })
              .catch(err => error(err));

            return {
              abort: () => {
                abort();
              }
            };
          }
        }}
        allowRevert={false}
        allowMultiple={false}
        imageTransformOutputMimeType="image/jpeg"
        imageCropAspectRatio="3:2"
        imageResizeTargetWidth="600"
        onprocessfile={handleUploadComplete}
      />
    </div>
  );
};

RecipePhotoDisplay.propTypes = {
  addPhoto: PropTypes.func,
  photo: PropTypes.object,
  recipeId: PropTypes.string,
  className: PropTypes.string,
  updatePhoto: PropTypes.func
};

export default RecipePhotoDisplay;
