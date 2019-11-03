import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';

import css from './ProfileTabs.css';

const tabs = {
  dashboard: 'Dashboard',
  recipes: 'Recipes',
  connections: 'Connections',
  account: 'Account'
};

const ProfileTabs = ({ chef, tab }) => (
  <ul className={css.profileTabs}>
    {Object.entries(tabs).map(([tabSlug, tabName]) => (
      <li
        key={tabSlug}
        className={classnames({ [css.active]: tabSlug === tab })}
      >
        <Link
          href={`/chef/[slug]${tabSlug !== 'dashboard' ? `/${tabSlug}` : ''}`}
          as={`/chef/${chef.slug}${
            tabSlug !== 'dashboard' ? `/${tabSlug}` : ''
          }`}
        >
          <a>{tabName}</a>
        </Link>
      </li>
    ))}
  </ul>
);

ProfileTabs.propTypes = {
  chef: PropTypes.object,
  tab: PropTypes.string
};

export default ProfileTabs;
