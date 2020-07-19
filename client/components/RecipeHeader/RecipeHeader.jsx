import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import {
  MdEdit,
  MdCheck,
  MdTimer,
  MdLocalDining,
  MdAddAPhoto,
  MdDoNotDisturb,
  MdDeleteForever,
} from 'react-icons/md';
import { fraction } from 'mathjs';
import { useMutation } from '@apollo/react-hooks';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { TIME_OPTIONS } from '../../../constants';
import { getFieldValue, renderFieldWithMods } from '../../lib/recipe';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import { setRecipePhoto } from '../../actions/recipe';
import { setAlteration } from '../../actions/modification';
import CreateRecipeMutation from '../../graphql/CreateRecipe.graphql';
import RecipePhotoUploadMutation from '../../graphql/RecipePhotoUpload.graphql';
import RecipePhotoDeleteMutation from '../../graphql/RecipePhotoDelete.graphql';
import DiffText from '../DiffText';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import TextInput from '../TextInput';
import Textarea from '../Textarea';
import Tooltip from '../Tooltip';
import Select from '../Select';
import css from './RecipeHeader.module.css';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

const RecipeHeader = ({ placeholderPhoto }) => {
  const [createRecipe] = useMutation(CreateRecipeMutation);
  const [deletePhoto] = useMutation(RecipePhotoDeleteMutation);
  const [uploadFile] = useMutation(RecipePhotoUploadMutation);
  const { user } = useContext(UserContext);
  const {
    modification: { alterations },
    recipe,
    recipeDispatch,
    modificationDispatch,
  } = useContext(RecipeContext);
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({});
  const [editing, setEditing] = useState(!recipe ? 'title' : null);
  const validationTimeouts = useRef({});
  const containerRef = useRef();
  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const timeInputRef = useRef();
  const servingInputRef = useRef();
  const pond = useRef();

  const canDeletePhoto = Boolean(
    recipe &&
      !recipe.photo.startsWith('/static/placeholder') &&
      user &&
      (recipe.author.id === user.id || user.role === 'EXECUTIVE_CHEF')
  );

  const canUploadPhoto = Boolean(
    recipe &&
      user &&
      (user.id === recipe.author.id || user.role === 'EXECUTIVE_CHEF')
  );

  const getRecipeValue = (fieldName) =>
    getFieldValue(fieldName, recipe, alterations, edits);

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
        recipeId: recipe.uid,
      },
      context: {
        fetchOptions: {
          signal: controller.signal,
        },
      },
    })
      .then((res) => {
        setRecipePhoto(res.data.recipePhotoUpload.photo, recipeDispatch);
        load(res);
      })
      .catch((err) => error(err));

    return {
      abort: () => {
        controller.abort();
        abort();
      },
    };
  };

  const handleUploadComplete = (err, file) => {
    setTimeout(() => {
      pond.current.removeFile(file);
    }, 1000);
  };

  const handleDelete = () => {
    if (!canDeletePhoto) return;
    deletePhoto({
      variables: { recipeId: recipe.uid },
    }).then(({ data }) => {
      setRecipePhoto(data.recipePhotoDelete.photo, recipeDispatch);
    });
  };

  const enableEditing = (fieldName) => setEditing(fieldName);

  const disableEditing = () => setEditing(null);

  const handleClick = (e) => {
    if (!recipe) return;
    if (!containerRef.current) return;
    if (containerRef.current.contains(e.target)) return;
    disableEditing();
  };

  const handleRecipeChange = (e) => {
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

  const triggerUploadDialog = () => {
    pond.current.browse();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
      return;
    }
  };

  const handleSubmit = () => {
    const hasErrors = [
      'title',
      'description',
      'servingAmount',
      'servingType',
      'time',
    ].filter((fieldName) => validate(fieldName, getRecipeValue(fieldName)));

    if (recipe) {
      Object.entries(edits)
        .filter(([key]) => !hasErrors.includes(key))
        .forEach(([key, value]) => {
          setAlteration(recipe, key, value, modificationDispatch);
          delete edits[key];
          setEdits(edits);
        });
      disableEditing();
    } else if (hasErrors.length === 0) {
      createRecipe({
        variables: {
          title: getRecipeValue('title'),
          description: getRecipeValue('description'),
          time: getRecipeValue('time'),
          servingAmount: getRecipeValue('servingAmount'),
          servingType: getRecipeValue('servingType'),
        },
      }).then(({ data }) => {
        const { slug } = data.createRecipe;
        Router.replace('/recipes/[slug]', `/recipes/${slug}`);
      });
    }
  };

  const cancelEditing = () => {
    setErrors({});
    setEdits({});
    disableEditing();
  };

  const renderWithMods = (fieldName) =>
    renderFieldWithMods(fieldName, recipe, alterations, edits, errors);

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
        if (!Object.keys(TIME_OPTIONS).includes(value))
          err = 'Please select a level of commitment';
        break;
    }

    setErrors((errors) => ({
      ...errors,
      [fieldName]: err,
    }));

    return Boolean(err);
  };

  useEffect(() => {
    if (editing) {
      document.addEventListener('mousedown', handleClick);
      switch (editing) {
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
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [editing]);

  return (
    <header className={css.recipeHeader}>
      <figure className={css.recipePhoto}>
        <img src={recipe && recipe.photo ? recipe.photo : placeholderPhoto} />
        {canUploadPhoto && (
          <FilePond
            name="avatar"
            ref={pond}
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
      </figure>
      <form ref={containerRef} className={css.recipeDetails}>
        {!editing ? (
          <>
            <h1 role="button" onClick={() => enableEditing('title')}>
              {renderWithMods('title')}
            </h1>
            <h5>Recipe by {recipe.author.name}</h5>
            <p role="button" onClick={() => enableEditing('description')}>
              {renderWithMods('description')}
            </p>
          </>
        ) : (
          <div>
            <TextInput
              name="title"
              className={css.titleInput}
              inputRef={titleInputRef}
              placeholder="Recipe title"
              value={getRecipeValue('title')}
              onChange={handleRecipeChange}
              onKeyPress={handleKeyPress}
              error={errors.title}
            />
            <Textarea
              className={css.titleInput}
              inputRef={descriptionInputRef}
              name="description"
              value={getRecipeValue('description')}
              placeholder="Recipe description"
              onChange={handleRecipeChange}
              onKeyPress={handleKeyPress}
              error={errors.description}
            />
          </div>
        )}
        <div className={css.stats}>
          {!editing ? (
            <>
              <a onClick={() => enableEditing('time')}>
                <i>
                  <MdTimer />
                </i>
                {renderWithMods('time')}
              </a>
              <a onClick={() => enableEditing('servingAmount')}>
                <i>
                  <MdLocalDining />
                </i>
                {renderWithMods('servingAmount')}{' '}
                {renderWithMods('servingType')}
              </a>
            </>
          ) : (
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
                  {Object.entries(TIME_OPTIONS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val}
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
                  onKeyPress={handleKeyPress}
                  error={errors.servingAmount}
                />
                <TextInput
                  name="servingType"
                  className={css.servingType}
                  type="text"
                  value={getRecipeValue('servingType')}
                  placeholder="Servings"
                  onChange={handleRecipeChange}
                  onKeyPress={handleKeyPress}
                  error={errors.servingType}
                />
              </span>
            </div>
          )}
        </div>

        {!editing ? (
          <TextButtonGroup>
            <TextButton
              className={css.editBtn}
              onClick={() => enableEditing('title')}
            >
              <MdEdit />
              edit details
            </TextButton>
            {canUploadPhoto && (
              <TextButton
                className={css.uploadBtn}
                onClick={triggerUploadDialog}
              >
                <MdAddAPhoto />
                upload photo
              </TextButton>
            )}
            {canDeletePhoto && (
              <TextButton onClick={handleDelete}>
                <MdDeleteForever />
                delete photo
              </TextButton>
            )}
          </TextButtonGroup>
        ) : (
          <TextButtonGroup>
            <TextButton onClick={handleSubmit}>
              <MdCheck />
              save changes
            </TextButton>
            {recipe && (
              <TextButton onClick={cancelEditing}>
                <MdDoNotDisturb />
                discard changes
              </TextButton>
            )}
          </TextButtonGroup>
        )}
      </form>
    </header>
  );
};

RecipeHeader.propTypes = {
  placeholderPhoto: PropTypes.string,
};

export default RecipeHeader;
