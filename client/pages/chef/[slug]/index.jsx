import React from 'react';
import PropTypes from 'prop-types';
import Page from '../../../layouts/Main';
import ProfileHeader from '../../../components/Profile/Header';
import ProfileTabs from '../../../components/Profile/Tabs';
import ChefProfileQuery from '../../../graphql/ChefProfile.graphql';
import css from '../chef.css';

const ProfilePage = ({ chef, tab }) => {
  return (
    <Page>
      <div className={css.profilePage}>
        <ProfileHeader chef={chef} />
        <ProfileTabs chef={chef} tab={tab} />
      </div>
    </Page>
  );
};

ProfilePage.getInitialProps = async ({ query, apolloClient }) => {
  const { slug, tabSlug } = query;
  const { data } = await apolloClient.query({
    query: ChefProfileQuery,
    variables: {
      slug
    }
  });
  return {
    chef: data.user,
    tab: tabSlug || 'dashboard'
  };
};

ProfilePage.propTypes = {
  chef: PropTypes.object,
  tab: PropTypes.string
};

export default ProfilePage;
