import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import {
  MdEdit,
  MdCheck,
  MdTimer,
  MdLocalDining,
  MdAddAPhoto
} from 'react-icons/md';
import classnames from 'classnames';
import { fraction } from 'mathjs';
import { Mutation } from '@apollo/react-components';
import { withApollo } from '@apollo/react-hoc';
import { ApolloClient } from 'apollo-boost';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import { TIME_OPTIONS } from '../../config';
import DiffText from '../DiffText';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import TextInput from '../TextInput';
import Textarea from '../Textarea';
import Select from '../Select';
import css from './RecipeDetails.css';
import RecipePhotoUploadMutation from '../../graphql/RecipePhotoUpload.graphql';
import CreateRecipeMutation from '../../graphql/CreateRecipe.graphql';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const RecipeDetails = ({
  recipe,
  addPhoto,
  className,
  photosLength,
  recipeMods,
  saveAlteration,
  client
}) => {
  const [errors, setErrors] = useState({});
  const [edits, setEdit] = useState({});
  const [editing, setEditing] = useState(!recipe ? true : false);
  const [timeouts, setTimeoutValue] = useState({});

  const containerRef = useRef(null);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const servingInputRef = useRef(null);
  let pond;

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const enableEditing = () => {
    setEditing(true);
    document.addEventListener('mousedown', handleClick);
  };

  const edit = async refTitle => {
    await enableEditing();
    if (refTitle === 'description' && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    } else if (refTitle === 'title' && titleInputRef.current) {
      titleInputRef.current.focus();
    } else if (refTitle === 'time' && timeInputRef.current) {
      timeInputRef.current.focus();
    } else if (refTitle === 'servingAmount' && servingInputRef.current) {
      servingInputRef.current.focus();
    }
  };

  const disableEditing = () => {
    setEditing(false);
    document.removeEventListener('mousedown', handleClick);
  };

  const getRecipeValue = fieldName => {
    if (edits[fieldName] !== undefined) return edits[fieldName];

    if (!recipe) return '';
    const mod = recipeMods.find(mod => mod.field === fieldName);
    return mod !== undefined ? mod.value : recipe[fieldName];
  };

  const handleClick = e => {
    if (containerRef.current.contains(e.target)) return;
    disableEditing();
  };

  const handleRecipeChange = e => {
    const { name, value } = e.target;
    edits[name] = value;
    if (timeouts[name]) clearTimeout(timeouts[name]);
    setEdit({
      ...edits,
      name: value
    });
    setTimeout(() => {
      setTimeoutValue({
        ...timeouts,
        name: validate(name, value)
      });
    }, 1000);
  };

  const handleUploadComplete = (err, file) => {
    setTimeout(() => {
      pond.removeFile(file);
    }, 1000);
  };

  const triggerUploadDialog = () => {
    if (!editing) enableEditing();
    pond.browse();
  };

  const save = () => {
    const hasErrors = Object.keys(errors);
    if (recipe) {
      Object.entries(edits)
        .filter(([key]) => !hasErrors.includes(key))
        .forEach(([key, value]) => {
          saveAlteration(recipe, key, value);
        });
      setErrors({});
      disableEditing();
    } else if (hasErrors.length === 0) {
      client
        .mutate({
          mutation: CreateRecipeMutation,
          variables: {
            title: getRecipeValue('title'),
            description: getRecipeValue('description'),
            time: getRecipeValue('time'),
            servingAmount: getRecipeValue('servingAmount'),
            servingType: getRecipeValue('servingType')
          }
        })
        .then(({ data }) => {
          const { slug } = data.createRecipe;
          Router.replace(`/recipe?slug=${slug}`, `/recipes/${slug}`);
        });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateAll();
    save();
  };

  const renderWithMods = fieldName => {
    const mod = recipeMods.find(mod => mod.field === fieldName);
    if (mod !== undefined) {
      return <DiffText original={recipe[fieldName]} modified={mod.value} />;
    } else {
      return recipe[fieldName];
    }
  };

  const validateAll = () => {
    ['title', 'description', 'servingAmount', 'servingType', 'time'].forEach(
      fieldName => validate(fieldName, getRecipeValue(fieldName))
    );
  };

  const validate = (fieldName, value) => {
    setErrors({
      ...errors,
      [fieldName]: undefined
    });

    switch (fieldName) {
      case 'title':
        if (value.length < 5 || value.length > 255)
          setErrors({
            ...errors,
            title: 'Recipe title must be between 5 and 255 characters'
          });
        break;
      case 'description':
        if (value.length < 50 || value.length > 255)
          setErrors({
            ...errors,
            description: 'Description must be between 100 and 255 characters'
          });
        break;
      case 'servingAmount':
        try {
          if (!value) throw new Error();
          fraction(value);
        } catch {
          setErrors({
            ...errors,
            servingAmount:
              'Please enter serving amount as whole numbers and fractions (e.g. 1 1/3)'
          });
        }
        break;
      case 'servingType':
        if (value.length < 3 || value.length > 125)
          setErrors({
            ...errors,
            servingType: 'Serving type must be between 3 and 125 characters'
          });
        break;
      case 'time':
        if (!TIME_OPTIONS.includes(value))
          setErrors({
            ...errors,
            time: 'Please select a level of commitment'
          });
        break;
    }
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className={classnames(css.details, className)}
    >
      {!editing && (
        <>
          <h1>
            <a onClick={() => edit('title')}>{renderWithMods('title')}</a>
          </h1>
          <h3>Recipe by {recipe.author.name}</h3>
          <p>
            <a onClick={() => edit('description')}>
              {renderWithMods('description')}
            </a>
          </p>
        </>
      )}

      {editing && (
        <div>
          <TextInput
            name="title"
            className={css.titleInput}
            inputRef={titleInputRef}
            placeholder="Recipe title"
            value={getRecipeValue('title')}
            onChange={e => handleRecipeChange(e)}
            error={errors.title}
          />
          <Textarea
            className={css.titleInput}
            inputRef={descriptionInputRef}
            name="description"
            value={getRecipeValue('description')}
            placeholder="Recipe description"
            onChange={handleRecipeChange}
            error={errors.description}
          />
        </div>
      )}
      <div className={css.stats}>
        {!editing && (
          <>
            <a onClick={() => edit('time')}>
              <i>
                <MdTimer />
              </i>
              {getRecipeValue('time')}
            </a>
            <a onClick={() => edit('servingAmount')}>
              <i>
                <MdLocalDining />
              </i>
              {getRecipeValue('servingAmount')} {getRecipeValue('servingType')}
            </a>
          </>
        )}

        {editing && (
          <div className={css.statInputs}>
            <label className={css.timeInput}>
              <i>
                <MdTimer />
              </i>
              <Select
                name="time"
                onChange={handleRecipeChange}
                inputRef={timeInputRef}
                value={getRecipeValue('time')}
                error={errors.time}
              >
                <option value="">-- commitment --</option>
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </label>
            <span className={css.servingInput}>
              <label htmlFor="recipeServingAmount">
                <i>
                  <MdLocalDining />
                </i>
              </label>
              <TextInput
                inputRef={servingInputRef}
                id="recipeServingAmount"
                name="servingAmount"
                className={css.servingAmount}
                type="text"
                value={getRecipeValue('servingAmount')}
                placeholder="Amnt"
                onChange={handleRecipeChange}
                error={errors.servingAmount}
              />
              <TextInput
                name="servingType"
                className={css.servingType}
                type="text"
                value={getRecipeValue('servingType')}
                placeholder="Servings"
                onChange={handleRecipeChange}
                error={errors.servingType}
              />
            </span>
          </div>
        )}
      </div>

      <div className={classnames({ [css.visuallyHidden]: !editing })}>
        <Mutation mutation={RecipePhotoUploadMutation}>
          {uploadFile => (
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
                      recipeId: recipe.uid,
                      index: photosLength
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
              allowMultiple={true}
              imageTransformOutputMimeType="image/jpeg"
              imageCropAspectRatio="3:2"
              imageResizeTargetWidth="600"
              onprocessfile={handleUploadComplete}
            />
          )}
        </Mutation>
      </div>

      {!editing && (
        <TextButtonGroup>
          <TextButton className={css.editBtn} onClick={() => edit('title')}>
            <MdEdit />
            edit details
          </TextButton>
          <TextButton className={css.uploadBtn} onClick={triggerUploadDialog}>
            <MdAddAPhoto />
            upload photos
          </TextButton>
        </TextButtonGroup>
      )}

      {editing && (
        <TextButton type="submit">
          <MdCheck />
          save changes
        </TextButton>
      )}
    </form>
  );
};

RecipeDetails.propTypes = {
  className: PropTypes.string,
  recipe: PropTypes.object,
  recipeMods: PropTypes.arrayOf(PropTypes.object),
  saveAlteration: PropTypes.func,
  addPhoto: PropTypes.func,
  photosLength: PropTypes.number,
  client: PropTypes.instanceOf(ApolloClient)
};

RecipeDetails.displayName = 'RecipeDetails';

export default withApollo(RecipeDetails);
