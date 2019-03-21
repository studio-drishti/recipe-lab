import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSchool, MdTimer } from 'react-icons/md';
import { Query } from 'react-apollo';

import UserContext from '../../utils/UserContext';
import Page from '../../layouts/Main';
import Recipe from '../../components/Recipe';
import css from './recipe.css';
import RecipeWithModificationQuery from '../../graphql/RecipeWithModification.graphql';

export default class IndexPage extends Component {
  static displayName = 'IndexPage';
  static contextType = UserContext;
  static propTypes = {
    recipeId: PropTypes.string
  };

  static async getInitialProps(context) {
    const { id } = context.query;
    return {
      recipeId: id
    };
  }

  render() {
    const { user } = this.context;
    return (
      <Page>
        <Query
          query={RecipeWithModificationQuery}
          variables={{ id: this.props.recipeId, user: user ? user.id : null }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            const { recipe } = data;

            return (
              <>
                <header
                  style={{
                    backgroundImage:
                      'url(https://loremflickr.com/1200/600/food,cooking,spaghetti)'
                  }}
                  className={css.header}
                >
                  <div className={css.title}>
                    <h1>{recipe.title}</h1>
                    <h2>By {recipe.author.name}</h2>
                    <p>{recipe.description}</p>
                  </div>
                  <div className={css.stats}>
                    <span>
                      <i>
                        <MdTimer />
                      </i>
                      {recipe.time}
                    </span>
                    <span>
                      <i>
                        <MdSchool />
                      </i>
                      {recipe.skill}
                    </span>
                  </div>
                </header>

                <Recipe recipe={recipe} />

                <div className={css.bio}>
                  <div>
                    <img src={recipe.author.avatar} />
                  </div>
                  <div>
                    <h3>About {recipe.author.name}</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Ut pellentesque commodo ante, nec facilisis odio faucibus
                      ac. In porta, arcu vel mattis posuere, massa felis
                      suscipit dolor, sit amet mattis augue nisl ac justo. Fusce
                      imperdiet, leo a viverra interdum, est augue lobortis leo,
                      et varius enim elit a leo. Maecenas orci lacus, commodo
                      sit amet aliquam ac, tincidunt non nisl. Ut velit lectus,
                      elementum ut pretium ultrices, posuere et ipsum.
                    </p>
                  </div>
                </div>
              </>
            );
          }}
        </Query>
      </Page>
    );
  }
}
