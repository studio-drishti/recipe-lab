import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import ChefContext from '../../../context/ChefContext';
import css from './Header.css';

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
        {chef.avatar ? (
          <img src={chef.avatar} />
        ) : (
          <img src="https://loremflickr.com/300/300/cook" />
        )}
      </div>
      <div>
        <h1>{chef.name}</h1>
        <h3>{chefTitle}</h3>
        <p>
          Donec rhoncus neque vel nisl laoreet dictum. Curabitur porttitor arcu
          sit amet diam pharetra tempor nec vitae lectus. Pellentesque accumsan
          condimentum lobortis.
        </p>
      </div>
      <div>
        <ul>
          <li>
            {chef.recipeCount}
            recipe{chef.recipeCount > 1 && 's'}
          </li>
          <li>
            {chef.modifiedRecipeCount}
            modified recipe{chef.modifiedRecipeCount > 1 && 's'}
          </li>
        </ul>
      </div>
    </header>
  );
};

ProfileHeader.propTypes = {
  chef: PropTypes.object
};

export default ProfileHeader;
