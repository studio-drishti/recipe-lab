import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import ChefProfileQuery from '../../../graphql/ChefProfile.graphql';
import Page from '../../../layouts/Profile';
import Account from '../../../components/Profile/Account';
import UserContext from '../../../context/UserContext';
import withAuthGuard from '../../../hoc/withAuthGuard';

const AccountPage = ({ chef }) => {
  const { user } = useContext(UserContext);

  if (!user || (user.role !== 'EXECUTIVE_CHEF' && chef.slug !== user.slug)) {
    return <Error statusCode={403} title="Forbidden" />;
  }

  return (
    <Page chef={chef} tab="account">
      <Account />
    </Page>
  );
};

AccountPage.getInitialProps = async ({ query, apolloClient }) => {
  const { slug } = query;
  const { data } = await apolloClient.query({
    query: ChefProfileQuery,
    variables: {
      slug,
    },
  });
  return {
    chef: data.user,
  };
};

AccountPage.propTypes = {
  chef: PropTypes.object,
};

export default withAuthGuard()(AccountPage);
