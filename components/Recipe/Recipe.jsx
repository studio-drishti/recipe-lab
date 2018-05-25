import Link from 'next/link'
import { Component } from 'react'
import Textarea from "react-textarea-autosize";
// import merge from 'deepmerge';

import css from './Recipe.css'
import { stepsToIngredientTotals, formatIngredientTotal } from '../../util/recipeTools';

class Recipe extends Component {
  state = {
    active: {
      item: 0,
      step: 0,
    },
    recipe: this.props.recipe,
    editing: false,
  }

  // componentDidMount() {
  //   if(localStorage.getItem('recipeMods') !== null) {
  //     const mods = JSON.parse(localStorage.getItem('recipeMods'));
  //     let { recipe } = this.state
  //     Object.entries(mods.steps).forEach(([key, val]) => {
  //       recipe.steps[key] = merge(recipe.steps[key], val);
  //     })
  //   }
  // }

  toggleEdit = () => {
    if(this.state.editing === false) {
      this.setState({editing: true})
    } else {
      this.setState({editing: false})
    }
  }

  // resetMods = () => {
  //   localStorage.removeItem('recipeMods')
  //   this.setState({recipe: this.props.recipe})
  // }

  handleStepChange = (e) => {
    const { name, value } = e.target
    const { recipe, active } = this.state
    recipe.items[active.item].steps[active.step][name] = value


    // localStorage.setItem('recipeMods', JSON.stringify(merge(
    //   localStorage.getItem('recipeMods') !== null ? JSON.parse(localStorage.getItem('recipeMods')) : {},
    //   {
    //     steps: {
    //       [this.state.currentStep]: {
    //         [name]: value
    //       }
    //     }
    //   }
    // )))

    this.setState({recipe})
  }

  setActiveStep = (itemI, stepI) => {
    this.setState({
      active: {
        item: itemI,
        step: stepI,
      }
    })
  }

  render() {
    const { recipe, active, editing } = this.state;
    return (
      <article className={css.recipe}>
        <div className={css.recipeMain}>
          {recipe.items.map(item => (
            <div>
              <h3>Ingredients for {item.name}</h3>
              <ul className={css.ingredients}>
                {stepsToIngredientTotals(item.steps).map((ingredient, i) => (
                  <li key={i}>
                    {formatIngredientTotal(ingredient)}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {recipe.items.map((item, itemI) => (
            <div key={item._id}>
              <h3>Directions for {item.name}</h3>
              <ol className={css.steps}>
                {item.steps.map((step, stepI) => (
                  <li key={step._id} onClick={() => this.setActiveStep(itemI, stepI)}>
                    {step.directions}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className={css.recipeDetail}>
            <div className={css.recipeActions}>
              <button onClick={this.toggleEdit}>
                <i className="material-icons">edit</i>
              </button>
              {/* <button onClick={this.resetMods}>
                <i className="material-icons">delete</i>
              </button> */}
            </div>
            {recipe.items[active.item].steps[active.step].ingredients.length > 0 && (
              <div>

                <h3>Ingredients Used</h3>
                <ul>
                  {recipe.items[active.item].steps[active.step].ingredients.map((ingredient, i) => (
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
                value={recipe.items[active.item].steps[active.step].directions}
                placeholder="Directions"
                onChange={this.handleStepChange} />
            ) : (
              <p>
                {recipe.items[active.item].steps[active.step].directions}
              </p>
            )}

            {editing ? (
              <Textarea
                name="notes"
                value={recipe.items[active.item].steps[active.step].notes}
                placeholder="Additional Notes"
                onChange={this.handleStepChange} />
            ) : (
              <p>
                {recipe.items[active.item].steps[active.step].notes}
              </p>
            )}
        </div>
      </article>
    )
  }
}

export default Recipe;
