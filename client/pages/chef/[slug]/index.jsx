import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import Page from '../../../layouts/Main';
import ProfileHeader from '../../../components/Profile/Header';
import ProfileTabs from '../../../components/Profile/Tabs';
import ChefProfileQuery from '../../../graphql/ChefProfile.graphql';
import ChefContext from '../../../context/ChefContext';
import css from '../chef.module.css';

const ProfilePage = props => {
  const [chef, setChef] = useState(props.chef);
  const [getChef] = useLazyQuery(ChefProfileQuery, {
    fetchPolicy: 'network-only',
    refetch: true,
    onCompleted: data => {
      setChef(data.user);
    }
  });

  const refreshChef = data => {
    if (data) {
      setChef(data);
    } else {
      getChef({
        variables: { slug: chef.slug }
      });
    }
  };

  return (
    <Page>
      <ChefContext.Provider value={{ chef, refreshChef, tab: props.tab }}>
        <div className={css.profilePage}>
          <ProfileHeader />
          <ProfileTabs chef={chef} tab={props.tab} />
        </div>
      </ChefContext.Provider>
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
