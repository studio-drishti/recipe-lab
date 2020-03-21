import React, { useCallback, useContext } from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import ChefContext from '../../../context/ChefContext';
import Dashboard from '../Dashboard';
import Account from '../Account';
import css from './Tabs.css';

const ProfileTabs = () => {
  const { chef, tab } = useContext(ChefContext);
  const tabs = {
    dashboard: 'Dashboard',
    recipes: 'Recipes',
    account: 'Account'
  };

  const printTab = useCallback(() => {
    switch (tab) {
      case 'dashboard':
        return <Dashboard />;
      case 'account':
        return <Account />;
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

export default ProfileTabs;
