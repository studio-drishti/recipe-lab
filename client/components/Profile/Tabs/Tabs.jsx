import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';
import Dashboard from '../Dashboard';
import css from './Tabs.css';

const ProfileTabs = ({ chef, tab }) => {
  const tabs = {
    dashboard: 'Dashboard',
    recipes: 'Recipes',
    account: 'Account'
  };

  const printTab = useCallback(() => {
    switch (tab) {
      case 'dashboard':
        return <Dashboard />;
      default:
        null;
    }
  }, [tab]);

  return (
    <div className={css.container}>
      <ul className={css.tabList}>
        {Object.entries(tabs).map(([tabSlug, tabName]) => (
          <li
            key={tabSlug}
            className={classnames({ [css.active]: tabSlug === tab })}
          >
            <Link
              href={`/chef/[slug]${
                tabSlug !== 'dashboard' ? '/[tabSlug]' : ''
              }`}
              as={`/chef/${chef.slug}${
                tabSlug !== 'dashboard' ? `/${tabSlug}` : ''
              }`}
            >
              <a>{tabName}</a>
            </Link>
          </li>
        ))}
      </ul>
      <div className={css.tabContent}>{printTab()}</div>
    </div>
  );
};

ProfileTabs.propTypes = {
  chef: PropTypes.object,
  tab: PropTypes.string
};

export default ProfileTabs;
