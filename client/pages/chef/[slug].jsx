import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../layouts/Main';
import ProfileHeader from '../../components/ProfileHeader';
import ChefProfileQuery from '../../graphql/ChefProfile.graphql';

const ProfilePage = ({ chef }) => {
  return (
    <Page>
      <ProfileHeader chef={chef} />
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
