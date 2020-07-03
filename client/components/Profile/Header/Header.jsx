import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getChefBio } from '../../../lib/chef';
import ChefContext from '../../../context/ChefContext';
import css from './Header.module.css';

const ProfileHeader = () => {
  const { chef } = useContext(ChefContext);

  const chefTitle = useMemo(() => {
    switch (chef.role) {
      case 'EXECUTIVE_CHEF':
        return 'Executive Chef';
      case 'SOUS_CHEF':
        return 'Sous Chef';
      case 'COMMIS_CHEF':
        return 'Commis Chef';
      default:
        return 'Kitchen Porter';
    }
  }, [chef.role]);

  return (
    <header>
      <div className={css.profilePhoto}>
        <img src={chef.avatar} />
      </div>
      <div>
        <h1>{chef.name}</h1>
        <h3>{chefTitle}</h3>
        <p>{getChefBio(chef)}</p>
      </div>
      <div>
        <ul>
          <li>
            {chef.recipeCount} recipe{chef.recipeCount > 1 && 's'}
          </li>
          {chef.modifiedRecipeCount > 0 && (
            <li>
              {chef.modifiedRecipeCount} modified recipe
              {chef.modifiedRecipeCount > 1 && 's'}
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

ProfileHeader.propTypes = {
  chef: PropTypes.object,
};

export default ProfileHeader;
