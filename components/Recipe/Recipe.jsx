import Link from 'next/link'
import { Component } from 'react'
import Textarea from "react-textarea-autosize";
import merge from 'deepmerge';

import css from './Recipe.css'
import { stepsToIngredientTotals, formatIngredientTotal } from '../../util/recipeTools';

class Recipe extends Component {
  state = {
    currentStep: 0,
    recipe: this.props.recipe,
    editing: false,
  }

  // componentDidMount() {
  //   if(localStorage.getItem('recipeMods') !== null) {
  //     const mods = JSON.parse(localStorage.getItem('recipeMods'));
  //     let { recipe } = this.state
  //     console.log(mods)
  //     recipe = merge(recipe, mods);
  //     this.setState({ recipe })
  //   }
  // }

  toggleEdit = (e) => {
    if(this.state.editing === false) {
      this.setState({editing: true})
    } else {
      this.setState({editing: false})
    }
  }

  handleStepChange = (e) => {
    const { name, value } = e.target
    const { recipe } = this.state
    recipe.steps[this.state.currentStep][name] = value


    // localStorage.setItem('recipeMods', JSON.stringify({
    //   steps: {
    //     [this.state.currentStep]: {
    //       [name]: value
    //     }
    //   }
    // }))

    this.setState({recipe})
  }

  render() {
    const { recipe, currentStep, editing } = this.state;
    return (
      <article className={css.recipe}>
        <div className={css.recipeMain}>
          <h3>Ingredients</h3>
          <ul className={css.ingredients}>
            {stepsToIngredientTotals(recipe.steps).map((ingredient, i) => (
              <li key={i}>
                {formatIngredientTotal(ingredient)}
              </li>
            ))}
          </ul>

          <h3>Directions</h3>
          <ol className={css.steps}>
            {recipe.steps.map((step, i) => (
              <li key={i} onClick={() => this.setState({currentStep: i})}>
                {step.directions}
              </li>
            ))}
          </ol>
        </div>
        <div className={css.recipeDetail}>
            <div className={css.recipeActions}>
              <button onClick={this.toggleEdit}>
                <i className="material-icons">edit</i>
              </button>
              <button>
                <i className="material-icons">delete</i>
              </button>
            </div>
            {recipe.steps[currentStep].ingredients.length > 0 && (
              <div>

                <h3>Ingredients Used</h3>
                <ul>
                  {recipe.steps[currentStep].ingredients.map((ingredient, i) => (
                    <li key={i}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      {ingredient.processing && `, ${ingredient.processing}`}
                    </li>
                  ))}
                </ul>

              </div>
            )}

            {editing ? (
              <Textarea
                name="directions"
                value={recipe.steps[currentStep].directions}
                placeholder="Directions"
                onChange={this.handleStepChange} />
            ) : (
              <p>
                {recipe.steps[currentStep].directions}
              </p>
            )}

            {editing ? (
              <Textarea
                name="notes"
                value={recipe.steps[currentStep].notes}
                placeholder="Additional Notes"
                onChange={this.handleStepChange} />
            ) : (
              <p>
                {recipe.steps[currentStep].notes}
              </p>
            )}
        </div>
      </article>
    )
  }
}

export default Recipe;
