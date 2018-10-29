import Link from 'next/link';
import css from './Submission.css';
import { Component } from 'react';

class Submission extends Component {
  state = {
    title: '',
    description: '',
    currentIngredient: 0,
    ingredients: [
      {
        ingredient: '',
        detail: ''
      }
    ]
  };

  addIngredient = () => {
    const { ingredients } = this.state;
    ingredients.push({
      ingredient: '',
      detail: ''
    });
    this.setState({ ingredients });
  };

  showIngredientDetails = i => {
    this.setState({ currentIngredient: i });
  };

  handleIngredientChange = e => {
    const { ingredients } = this.state;
    const i = e.target.getAttribute('data-index');
    ingredients[i].ingredient = e.target.value;
    this.setState({ ingredients });
  };

  handleIngredientDetailChange = e => {
    const { ingredients } = this.state;
    const i = e.target.getAttribute('data-index');
    ingredients[i].detail = e.target.value;
    this.setState({ ingredients });
  };

  render() {
    const { ingredients, currentIngredient } = this.state;
    return (
      <form className={css.form}>
        <fieldset className={css.primaryFieldset}>
          <label>
            Title
            <input type="text" />
          </label>

          <label>
            Description
            <textarea />
          </label>

          <p>Ingredients</p>
          {ingredients.map((ingredient, i) => (
            <label key={i}>
              <input
                type="text"
                placeholder={`Ingredient #${i}`}
                data-index={i}
                onChange={this.handleIngredientChange}
                onFocus={() => this.showIngredientDetails(i)}
              />
            </label>
          ))}
          <button type="button" onClick={this.addIngredient}>
            Add Ingredient
          </button>
        </fieldset>
        <fieldset className={css.secondaryFieldset}>
          <label>
            {`Additonal details about the ingredient: ${
              ingredients[currentIngredient].ingredient
            }`}
            <textarea
              value={ingredients[currentIngredient].detail}
              data-index={currentIngredient}
              onChange={this.handleIngredientDetailChange}
            />
          </label>
        </fieldset>
      </form>
    );
  }
}

export default Submission;
