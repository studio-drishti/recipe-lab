import React from 'react';
import PropTypes from 'prop-types';
import ChefDashboardQuery from '../../../graphql/ChefDashboardQuery.graphql';
import Page from '../../../layouts/Profile';
import Dashboard from '../../../components/Profile/Dashboard';

const ProfilePage = ({ chef, originalRecipes, modifiedRecipes }) => {
  return (
    <Page chef={chef} tab="dashboard">
      <Dashboard
        chef={chef}
        originalRecipes={originalRecipes}
        modifiedRecipes={modifiedRecipes}
      />
    </Page>
  );
};

ProfilePage.getInitialProps = async ({ query, apolloClient }) => {
  const { slug } = query;
  const { data } = await apolloClient.query({
    query: ChefDashboardQuery,
    variables: {
      slug,
    },
  });
  return data;
};

ProfilePage.propTypes = {
  chef: PropTypes.object,
};

export default ProfilePage;
