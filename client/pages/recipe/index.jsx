import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import { MdSchool, MdTimer } from 'react-icons/md';

import { API_URL } from '../../config';
import Layout from '../../components/Layout';
import Recipe from '../../components/Recipe';
import css from './recipe.css';

const Page = ({ recipe }) => (
  <Layout>
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
        <img src="https://loremflickr.com/300/300/man,portrait" />
      </div>
      <div>
        <h3>About {recipe.author.name}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
          pellentesque commodo ante, nec facilisis odio faucibus ac. In porta,
          arcu vel mattis posuere, massa felis suscipit dolor, sit amet mattis
          augue nisl ac justo. Fusce imperdiet, leo a viverra interdum, est
          augue lobortis leo, et varius enim elit a leo. Maecenas orci lacus,
          commodo sit amet aliquam ac, tincidunt non nisl. Ut velit lectus,
          elementum ut pretium ultrices, posuere et ipsum.
        </p>
      </div>
    </div>
  </Layout>
);

Page.propTypes = {
  recipe: PropTypes.object
};

Page.getInitialProps = async function(context) {
  const { id } = context.query;
  const recipeResponse = await fetch(`${API_URL}/api/recipes/${id}`);
  const recipe = await recipeResponse.json();
  // const modificationResponse = await fetch(`${API_URL}/api/modifications/?recipe=${id}`)
  // const modification = modificationResponse.json()
  return {
    recipe
    // modification
  };
};

export default Page;
