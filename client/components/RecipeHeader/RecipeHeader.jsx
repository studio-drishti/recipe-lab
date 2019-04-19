import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  MdEdit,
  MdCheck,
  MdTimer,
  MdLocalDining,
  MdAddAPhoto
} from 'react-icons/md';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';
import { Mutation } from 'react-apollo';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import { TIME_OPTIONS } from '../../config';
import DiffText from '../DiffText';
import TextButton from '../TextButton';
import TextButtonGroup from '../TextButtonGroup';
import RecipeCarousel from '../RecipeCarousel';
import css from './RecipeHeader.css';
import RecipePhotoUploadMutation from '../../graphql/RecipePhotoUpload.graphql';

registerPlugin(
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageResize
);

export default class RecipeHeader extends PureComponent {
  static displayName = 'RecipeHeader';
  static propTypes = {
    recipe: PropTypes.object,
    recipeMods: PropTypes.arrayOf(PropTypes.object),
    saveAlteration: PropTypes.func,
    addPhoto: PropTypes.func
  };

  state = {
    editing: false
  };

  headerRef = React.createRef();
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
    if (this.headerRef.current.contains(e.target)) return;
    this.disableEditing();
  };

  handleRecipeChange = e => {
    const { name, value } = e.target;
    const { recipe, saveAlteration } = this.props;
    saveAlteration(recipe, name, value);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.disableEditing();
  };

  handleUploadComplete = (err, file) => {
    setTimeout(() => {
      this.pond.removeFile(file);
    }, 1000);
  };

  render() {
    const { editing } = this.state;
    const { recipe, addPhoto } = this.props;
    return (
      <header ref={this.headerRef} className={css.header}>
        <form onSubmit={this.handleSubmit} className={css.details}>
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
            <div className={css.titleInputs}>
              <input
                type="text"
                name="title"
                ref={this.titleInputRef}
                placeholder="Recipe title"
                value={this.getRecipeValue('title')}
                onChange={this.handleRecipeChange}
              />
              <Textarea
                inputRef={this.descriptionInputRef}
                name="description"
                value={this.getRecipeValue('description')}
                placeholder="Recipe description"
                onChange={this.handleRecipeChange}
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
                <label>
                  <i>
                    <MdTimer />
                  </i>
                  <select
                    name="time"
                    onChange={this.handleRecipeChange}
                    ref={this.timeInputRef}
                    value={this.getRecipeValue('time')}
                  >
                    {TIME_OPTIONS.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
                <span className={css.servingInput}>
                  <label htmlFor="recipeServingAmount">
                    <i>
                      <MdLocalDining />
                    </i>
                  </label>
                  <input
                    ref={this.servingInputRef}
                    id="recipeServingAmount"
                    name="servingAmount"
                    className={css.servingAmount}
                    type="text"
                    value={this.getRecipeValue('servingAmount')}
                    placeholder="Amnt"
                    onChange={this.handleRecipeChange}
                  />
                  <input
                    name="servingType"
                    className={css.servingType}
                    type="text"
                    value={this.getRecipeValue('servingType')}
                    placeholder="Servings"
                    onChange={this.handleRecipeChange}
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
                        variables: { file, recipeId: recipe.uid }
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
            <TextButton onClick={this.disableEditing}>
              <MdCheck />
              save changes
            </TextButton>
          )}
        </form>

        <div className={css.carousel}>
          <RecipeCarousel photos={[...recipe.photos]} />
        </div>
      </header>
    );
  }
}
