import React, { useContext } from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import ChefContext from '../../../context/ChefContext';
import UserContext from '../../../context/UserContext';
import css from './Tabs.module.css';

const ProfileTabs = ({ children, tab }) => {
  const { user } = useContext(UserContext);
  const { chef } = useContext(ChefContext);

  return (
    <div className={css.container}>
      <ul className={css.tabList}>
        <li className={classnames({ [css.active]: tab === 'dashboard' })}>
          <Link href={`/chef/[slug]`} as={`/chef/${chef.slug}`}>
            <a>Overview</a>
          </Link>
        </li>
        <li className={classnames({ [css.active]: tab === 'recipes' })}>
          <Link href={`/chef/[slug]/recipes`} as={`/chef/${chef.slug}/recipes`}>
            <a>Recipes</a>
          </Link>
        </li>
        {user && (user.slug === chef.slug || user.role === 'EXECUTIVE_CHEF') && (
          <li className={classnames({ [css.active]: tab === 'account' })}>
            <Link
              href={`/chef/[slug]/account`}
              as={`/chef/${chef.slug}/account`}
            >
              <a>Account</a>
            </Link>
          </li>
        )}
        <li className={classnames({ [css.active]: tab === 'field-notes' })}>
          <Link
            href={`/chef/[slug]/field-notes`}
            as={`/chef/${chef.slug}/field-notes`}
          >
            <a>Field Notes</a>
          </Link>
        </li>
      </ul>
      <div className={css.tabContent}>{children}</div>
    </div>
  );
};

export default ProfileTabs;
