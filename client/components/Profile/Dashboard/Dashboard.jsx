import React from 'react';
import Link from 'next/link';
import css from './Dashboard.module.css';

const Dashboard = ({ originalRecipes, chef }) => (
  <div>
    {originalRecipes.length && (
      <>
        <h2>Recently Updated</h2>
        <div className={css.recipesList}>
          {originalRecipes.map((recipe) => (
            <div key={recipe.uid}>
              <Link href="/recipes/[slug]" as={`/recipes/${recipe.slug}`}>
                <a>
                  <img src={recipe.photo} />
                </a>
              </Link>
              <p>{recipe.title}</p>
            </div>
          ))}
        </div>
        <p>
          <Link href="/chef/[slug]/recipes" as={`/chef/${chef.slug}/recipes`}>
            <a>See All Recipes &rarr;</a>
          </Link>
        </p>
      </>
    )}
  </div>
);

export default Dashboard;
