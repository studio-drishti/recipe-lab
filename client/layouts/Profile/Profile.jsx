import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ProfileHeader from '../../components/Profile/Header';
import ProfileTabs from '../../components/Profile/Tabs';
import ChefProfileQuery from '../../graphql/ChefProfile.graphql';
import ChefContext from '../../context/ChefContext';
import css from './Profile.module.css';

const ProfileLayout = (props) => {
  const [chef, setChef] = useState(props.chef);
  const [getChef] = useLazyQuery(ChefProfileQuery, {
    fetchPolicy: 'network-only',
    refetch: true,
    onCompleted: (data) => {
      setChef(data.user);
    },
  });

  const refreshChef = (data) => {
    if (data) {
      setChef(data);
    } else {
      getChef({
        variables: { slug: chef.slug },
      });
    }
  };

  return (
    <ChefContext.Provider value={{ chef, refreshChef }}>
      <div className={css.container}>
        <Navigation />
        <div className={css.pageContents}>
          <ProfileHeader />
          <ProfileTabs chef={chef} tab={props.tab}>
            {props.children}
          </ProfileTabs>
        </div>
        <Footer />
      </div>
    </ChefContext.Provider>
  );
};

export default ProfileLayout;
