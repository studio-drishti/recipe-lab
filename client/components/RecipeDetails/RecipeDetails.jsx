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
import { Mutation, useApolloClient } from 'react-apollo';
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
  saveAlteration
}) => {
  const client = useApolloClient();
  const [errors, setErrors] = useState({});
  const [edits, setEdit] = useState({});
  const [editing, setEditing] = useState(!recipe ? true : false);
  const validationTimeouts = useRef({});
  const containerRef = useRef();
  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const timeInputRef = useRef();
  const servingInputRef = useRef();
  let pond;

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const enableEditing = async fieldName => {
    await setEditing(true);
    document.addEventListener('mousedown', handleClick);
    switch (fieldName) {
      case 'description':
        descriptionInputRef.current.focus();
        break;
      case 'time':
        timeInputRef.current.focus();
        break;
      case 'servingAmount':
        servingInputRef.current.focus();
        break;
      default:
        titleInputRef.current.focus();
        break;
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

    if (validationTimeouts.current[name])
      clearTimeout(validationTimeouts.current[name]);

    setEdit({
      ...edits,
      name: value
    });

    validationTimeouts.current[name] = setTimeout(() => {
      validate(name, value);
      delete validationTimeouts.current[name];
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

  const handleSubmit = async e => {
    e.preventDefault();

    const hasErrors = [
      'title',
      'description',
      'servingAmount',
      'servingType',
      'time'
    ].filter(fieldName => validate(fieldName, getRecipeValue(fieldName)));

    if (recipe) {
      Object.entries(edits)
        .filter(([key]) => !hasErrors.includes(key))
        .forEach(([key, value]) => {
          saveAlteration(recipe, key, value);
        });
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
          Router.replace('/recipes/[slug]', `/recipes/${slug}`);
        });
    }
  };

  const renderWithMods = fieldName => {
    const mod = recipeMods.find(mod => mod.field === fieldName);
    if (mod !== undefined) {
      return <DiffText original={recipe[fieldName]} modified={mod.value} />;
    } else {
      return recipe[fieldName];
    }
  };

  const validate = (fieldName, value) => {
    let err = undefined;

    switch (fieldName) {
      case 'title':
        if (value.length < 5 || value.length > 255)
          err = 'Recipe title must be between 5 and 255 characters';
        break;
      case 'description':
        if (value.length < 50 || value.length > 255)
          err = 'Description must be between 100 and 255 characters';
        break;
      case 'servingAmount':
        try {
          if (!value) throw new Error();
          fraction(value);
        } catch {
          err =
            'Serving amount must be whole numbers and fractions (e.g. 1 1/3)';
        }
        break;
      case 'servingType':
        if (value.length < 3 || value.length > 125)
          err = 'Serving type must be between 3 and 125 characters';
        break;
      case 'time':
        if (!TIME_OPTIONS.includes(value))
          err = 'Please select a level of commitment';
        break;
    }

    setErrors(errors => ({
      ...errors,
      [fieldName]: err
    }));

    return Boolean(err);
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
            <a onClick={() => enableEditing('title')}>
              {renderWithMods('title')}
            </a>
          </h1>
          <h3>Recipe by {recipe.author.name}</h3>
          <p>
            <a onClick={() => enableEditing('description')}>
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
            onChange={handleRecipeChange}
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
            <a onClick={() => enableEditing('time')}>
              <i>
                <MdTimer />
              </i>
              {getRecipeValue('time')}
            </a>
            <a onClick={() => enableEditing('servingAmount')}>
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
          <TextButton
            className={css.editBtn}
            onClick={() => enableEditing('title')}
          >
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
  photosLength: PropTypes.number
};

RecipeDetails.displayName = 'RecipeDetails';

export default RecipeDetails;
