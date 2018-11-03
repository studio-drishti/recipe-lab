import React from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { API_URL } from '../config';
import Layout from '../components/Layout';

const Page = ({ recipes }) => (
  <Layout>
    {recipes.map((recipe, i) => (
      <div key={i}>
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <Link as={`/recipes/${recipe._id}`} href={`/recipe?id=${recipe._id}`}>
          <a>Show me more!</a>
        </Link>
      </div>
    ))}
  </Layout>
);

Page.getInitialProps = async function() {
  const res = await fetch(`${API_URL}/api/recipes`);
  const recipes = await res.json();

  return {
    recipes
  };
};

Page.propTypes = {
  recipes: PropTypes.object
};

export default Page;
