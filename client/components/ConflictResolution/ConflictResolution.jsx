import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import UserContext from '../../context/UserContext';

const ConflictResolution = ({ recipes }) => {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const dismiss = () => {
    if ('returnTo' in router.query) {
      router.replace('/recipes/[slug]', `/recipes/${router.query.returnTo}`);
    } else {
      router.replace('/chef/[slug]', `/chef/${user.slug}`);
    }
  };

  return (
    <div>
      <p>Oh Noes! Looks like we have some conflicts here...</p>
      {recipes.map((recipe) => (
        <p key={recipe.uid}>{recipe.title}</p>
      ))}
      <button onClick={dismiss}>I don't care</button>
    </div>
  );
};

ConflictResolution.propTypes = {
  recipes: PropTypes.array,
};

export default ConflictResolution;
