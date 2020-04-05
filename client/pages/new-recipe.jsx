import React from 'react';
import PropTypes from 'prop-types';
import withAuthGuard from '../utils/withAuthGuard.jsx';
import Recipe from '../components/Recipe';
import Page from '../layouts/Main';

const NewRecipePage = ({ placeholderPhoto }) => (
  <Page>
    <Recipe placeholderPhoto={placeholderPhoto} />
  </Page>
);

NewRecipePage.propTypes = {
  placeholderPhoto: PropTypes.string
};

NewRecipePage.getInitialProps = () => {
  return {
    placeholderPhoto: `/static/placeholders/recipe-${Math.floor(
      Math.random() * 3 + 1
    )}.jpg`
  };
};

export default withAuthGuard(NewRecipePage);
