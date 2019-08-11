import React, { Component } from 'react';
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
import math from 'mathjs';
import { Mutation, withApollo } from 'react-apollo';
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

class RecipeDetails extends Component {
  static displayName = 'RecipeDetails';
  static propTypes = {
    className: PropTypes.string,
    recipe: PropTypes.object,
    recipeMods: PropTypes.arrayOf(PropTypes.object),
    saveAlteration: PropTypes.func,
    addPhoto: PropTypes.func,
    photosLength: PropTypes.number,
    client: PropTypes.instanceOf(ApolloClient)
  };

  state = {
    errors: {},
    edits: {},
    timeouts: {},
    editing: !this.props.recipe ? true : false
  };

  containerRef = React.createRef();
  titleInputRef = React.createRef();
  descriptionInputRef = React.createRef();
  timeInputRef = React.createRef();
  skillInputRef = React.createRef();
  servingInputRef = React.createRef();

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  renderWithMods = fieldName => {
    const { recipeMods, recipe } = this.props;
    const mod = recipeMods.find(mod => mod.field === fieldName);
    if (mod !== undefined) {
      return <DiffText original={recipe[fieldName]} modified={mod.value} />;
    } else {
      return recipe[fieldName];
    }
  };

  getRecipeValue = fieldName => {
    const { recipe, recipeMods } = this.props;
    const { edits } = this.state;

    if (edits[fieldName] !== undefined) return edits[fieldName];

    if (!recipe) return '';

    const mod = recipeMods.find(mod => mod.field === fieldName);

    return mod !== undefined ? mod.value : recipe[fieldName];
  };

  enableEditing = () => {
    this.setState({ editing: true });
    document.addEventListener('mousedown', this.handleClick);
  };

  enableEditingTitle = async () => {
    await this.enableEditing();
    if (this.titleInputRef.current) this.titleInputRef.current.focus();
  };

  enableEditingDescription = async () => {
    await this.enableEditing();
    if (this.descriptionInputRef.current)
      this.descriptionInputRef.current.focus();
  };

  enableEditingTime = async () => {
    await this.enableEditing();
    if (this.timeInputRef.current) this.timeInputRef.current.focus();
  };

  enableEditingSkill = async () => {
    await this.enableEditing();
    if (this.skillInputRef.current) this.skillInputRef.current.focus();
  };

  enableEditingServing = async () => {
    await this.enableEditing();
    if (this.servingInputRef.current) this.servingInputRef.current.focus();
  };

  disableEditing = () => {
    this.setState({ editing: false });
    document.removeEventListener('mousedown', this.handleClick);
  };

  triggerUploadDialog = () => {
    const { editing } = this.state;
    if (!editing) this.enableEditing();
    this.pond.browse();
  };

  handleClick = e => {
    if (this.containerRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  save = () => {
    const { recipe, saveAlteration, client } = this.props;
    const { edits, errors } = this.state;
    const hasErrors = Object.keys(errors);
    if (recipe) {
      Object.entries(edits)
        .filter(([key]) => {
          !hasErrors.includes(key);
        })
        .forEach(([key, value]) => {
          saveAlteration(recipe, key, value);
        });
      this.setState({ edits: {} });
      this.disableEditing();
    } else if (hasErrors.length === 0) {
      client
        .mutate({
          mutation: CreateRecipeMutation,
          variables: {
            title: this.getRecipeValue('title'),
            description: this.getRecipeValue('description'),
            time: this.getRecipeValue('time'),
            servingAmount: this.getRecipeValue('servingAmount'),
            servingType: this.getRecipeValue('servingType')
          }
        })
        .then(({ data }) => {
          const { slug } = data.createRecipe;
          Router.replace(`/recipe?slug=${slug}`, `/recipes/${slug}`);
        });
    }
  };

  validate = (fieldName, value) => {
    const { errors } = this.state;

    delete errors[fieldName];

    switch (fieldName) {
      case 'title':
        if (value.length < 5 || value.length > 255)
          errors.title = 'Recipe title must be between 5 and 255 characters';
        break;
      case 'description':
        if (value.length < 50 || value.length > 255)
          errors.description =
            'Description must be between 100 and 255 characters';
        break;
      case 'servingAmount':
        try {
          if (!value) throw new Error();
          math.fraction(value);
        } catch {
          errors.servingAmount =
            'Please enter serving amount as whole numbers and fractions (e.g. 1 1/3)';
        }
        break;
      case 'servingType':
        if (value.length < 3 || value.length > 125)
          errors.servingType =
            'Serving type must be between 3 and 125 characters';
        break;
      case 'time':
        if (!TIME_OPTIONS.includes(value))
          errors.time = 'Please select a level of commitment';
        break;
    }
    this.setState({ errors });
  };

  validateAll = () => {
    ['title', 'description', 'servingAmount', 'servingType', 'time'].forEach(
      fieldName => this.validate(fieldName, this.getRecipeValue(fieldName))
    );
  };

  handleRecipeChange = e => {
    const { name, value } = e.target;
    const { edits, timeouts } = this.state;
    edits[name] = value;
    if (timeouts[name]) clearTimeout(timeouts[name]);
    timeouts[name] = setTimeout(() => this.validate(name, value), 1000);
    this.setState({ timeouts, edits });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.validateAll();
    this.save();
  };

  handleUploadComplete = (err, file) => {
    setTimeout(() => {
      this.pond.removeFile(file);
    }, 1000);
  };

  render() {
    const { editing, errors } = this.state;
    const { recipe, addPhoto, className, photosLength } = this.props;
    return (
      <form
        ref={this.containerRef}
        onSubmit={this.handleSubmit}
        className={classnames(css.details, className)}
      >
        {!editing && (
          <>
            <h1>
              <a onClick={this.enableEditingTitle}>
                {this.renderWithMods('title')}
              </a>
            </h1>
            <h3>Recipe by {recipe.author.name}</h3>
            <p>
              <a onClick={this.enableEditingDescription}>
                {this.renderWithMods('description')}
              </a>
            </p>
          </>
        )}

        {editing && (
          <div>
            <TextInput
              name="title"
              className={css.titleInput}
              inputRef={this.titleInputRef}
              placeholder="Recipe title"
              value={this.getRecipeValue('title')}
              onChange={this.handleRecipeChange}
              error={errors.title}
            />
            <Textarea
              className={css.titleInput}
              inputRef={this.descriptionInputRef}
              name="description"
              value={this.getRecipeValue('description')}
              placeholder="Recipe description"
              onChange={this.handleRecipeChange}
              error={errors.description}
            />
          </div>
        )}
        <div className={css.stats}>
          {!editing && (
            <>
              <a onClick={this.enableEditingTime}>
                <i>
                  <MdTimer />
                </i>
                {this.getRecipeValue('time')}
              </a>
              <a onClick={this.enableEditingServing}>
                <i>
                  <MdLocalDining />
                </i>
                {this.getRecipeValue('servingAmount')}{' '}
                {this.getRecipeValue('servingType')}
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
                  onChange={this.handleRecipeChange}
                  inputRef={this.timeInputRef}
                  value={this.getRecipeValue('time')}
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
                  inputRef={this.servingInputRef}
                  id="recipeServingAmount"
                  name="servingAmount"
                  className={css.servingAmount}
                  type="text"
                  value={this.getRecipeValue('servingAmount')}
                  placeholder="Amnt"
                  onChange={this.handleRecipeChange}
                  error={errors.servingAmount}
                />
                <TextInput
                  name="servingType"
                  className={css.servingType}
                  type="text"
                  value={this.getRecipeValue('servingType')}
                  placeholder="Servings"
                  onChange={this.handleRecipeChange}
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
                ref={ref => (this.pond = ref)}
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
                onprocessfile={this.handleUploadComplete}
              />
            )}
          </Mutation>
        </div>

        {!editing && (
          <TextButtonGroup>
            <TextButton
              className={css.editBtn}
              onClick={this.enableEditingTitle}
            >
              <MdEdit />
              edit details
            </TextButton>
            <TextButton
              className={css.uploadBtn}
              onClick={this.triggerUploadDialog}
            >
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
  }
}

export default withApollo(RecipeDetails);
