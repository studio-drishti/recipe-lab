import Link from 'next/link'
import css from './Recipe.css'
import { Component } from 'react'

class Recipe extends Component {
  state = {
    currentStep: 0,
    recipe: this.props.recipe,
  }

  render() {
    const { recipe, currentStep } = this.state;
    return (
      <article className={css.recipe}>
        <div className={css.recipeMain}>
          <h3>Ingredients</h3>
          <ul className={css.ingredients}>
            {recipe.steps.filter(step => step.ingredients.length > 0).map((step, i) => (
              <li key={i}>
                <small>Step {i + 1}</small>
                <ul>
                  {step.ingredients.map((ingredient, i) => (
                    <li key={i}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      {ingredient.processing && `, ${ingredient.processing}`}
                    </li>
                  ))}
                </ul>
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
            {recipe.steps[currentStep].ingredients.length > 0 &&
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
            }
            <p>
              {recipe.steps[currentStep].directions}
            </p>
            {recipe.steps[currentStep].notes &&
              <p>
                {recipe.steps[currentStep].notes}
              </p>
            }
        </div>
      </article>
    )
  }
}

export default Recipe;
