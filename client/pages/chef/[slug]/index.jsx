import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../../layouts/Main';
import ProfileHeader from '../../../components/ProfileHeader';
import ProfileTabs from '../../../components/ProfileTabs';
import ChefProfileQuery from '../../../graphql/ChefProfile.graphql';

const ProfilePage = ({ chef }) => {
  return (
    <Page>
      <ProfileHeader chef={chef} />
      <ProfileTabs chef={chef} tab="dashboard" />
      <h1>Dashboard</h1>
    </Page>
  );
};

ProfilePage.getInitialProps = async ({ query, apolloClient }) => {
  const { slug } = query;
  const { data } = await apolloClient.query({
    query: ChefProfileQuery,
    variables: {
      slug
    }
  });
  return {
    chef: data.user
  };
};

ProfilePage.propTypes = {
  chef: PropTypes.object
};

export default ProfilePage;
