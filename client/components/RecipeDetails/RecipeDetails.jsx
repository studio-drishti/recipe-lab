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
  MdDeleteForever
} from 'react-icons/md';
import classnames from 'classnames';
import { fraction } from 'mathjs';
import { useMutation } from 'react-apollo';

import { TIME_OPTIONS } from '../../config';
import UserContext from '../../context/UserContext';
import RecipeContext from '../../context/RecipeContext';
import { setRecipePhoto } from '../../actions/recipe';
import { setAlteration } from '../../actions/modification';
import CreateRecipeMutation from '../../graphql/CreateRecipe.graphql';
import RecipePhotoDeleteMutation from '../../graphql/RecipePhotoDelete.graphql';
import DiffText from '../DiffText';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import TextInput from '../TextInput';
import Textarea from '../Textarea';
import Tooltip from '../Tooltip';
import Select from '../Select';
import css from './RecipeDetails.module.css';

const RecipeDetails = ({ className }) => {
  const [createRecipe] = useMutation(CreateRecipeMutation);
  const [deletePhoto] = useMutation(RecipePhotoDeleteMutation);
  const { user } = useContext(UserContext);
  const {
    modification: { alterations },
    recipe,
    recipeDispatch,
    modificationDispatch
  } = useContext(RecipeContext);
  const [errors, setErrors] = useState({});
  const [edits, setEdits] = useState({});
  const [editing, setEditing] = useState(!recipe ? true : false);
  const validationTimeouts = useRef({});
  const containerRef = useRef();
  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const timeInputRef = useRef();
  const servingInputRef = useRef();

  const canDeletePhoto = Boolean(
    recipe &&
      !recipe.photo.startsWith('/static/placeholder') &&
      user &&
      (recipe.author.id === user.id || user.role === 'EXECUTIVE_CHEF')
  );

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleDelete = () => {
    if (!canDeletePhoto) return;
    deletePhoto({
      variables: { recipeId: recipe.uid }
    }).then(({ data }) => {
      setRecipePhoto(data.recipePhotoDelete.photo, recipeDispatch);
    });
  };

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
    const mod = alterations.find(
      mod => mod.sourceId === recipe.uid && mod.field === fieldName
    );
    return mod !== undefined ? mod.value : recipe[fieldName];
  };

  const handleClick = e => {
    if (!containerRef.current) return;
    if (containerRef.current.contains(e.target)) return;
    disableEditing();
  };

  const handleRecipeChange = e => {
    const { name, value } = e.target;

    if (validationTimeouts.current[name])
      clearTimeout(validationTimeouts.current[name]);

    setEdits({
      ...edits,
      [name]: value
    });

    validationTimeouts.current[name] = setTimeout(() => {
      validate(name, value);
      delete validationTimeouts.current[name];
    }, 1000);
  };

  const triggerUploadDialog = () => {
    // TODO: Figure out how to restore this functionality now that filepond has moved to RecipePhoto
    // if (!editing) enableEditing();
    // pond.browse();
  };

  const handleKeyPress = e => {
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
      'time'
    ].filter(fieldName => validate(fieldName, getRecipeValue(fieldName)));

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
          servingType: getRecipeValue('servingType')
        }
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

  const renderWithMods = fieldName => {
    if (edits[fieldName] !== undefined && errors[fieldName]) {
      return (
        <Tooltip tip={errors[fieldName]}>
          <DiffText
            className={css.error}
            original={recipe[fieldName]}
            modified={edits[fieldName]}
          />
        </Tooltip>
      );
    }

    const mod = alterations.find(
      mod => mod.sourceId === recipe.uid && mod.field === fieldName
    );
    if (mod !== undefined) {
      return <DiffText original={recipe[fieldName]} modified={mod.value} />;
    }

    return recipe[fieldName];
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
    <form ref={containerRef} className={classnames(css.details, className)}>
      {!editing ? (
        <>
          <h1 role="button" onClick={() => enableEditing('title')}>
            {renderWithMods('title')}
          </h1>
          <h3>Recipe by {recipe.author.name}</h3>
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
              {renderWithMods('servingAmount')} {renderWithMods('servingType')}
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
          <TextButton className={css.uploadBtn} onClick={triggerUploadDialog}>
            <MdAddAPhoto />
            upload photo
          </TextButton>
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
  );
};

RecipeDetails.propTypes = {
  className: PropTypes.string
};

export default RecipeDetails;
