import { CHEF_ROLES } from '../constants';

export const getChefBio = (chef) => {
  if (chef.bio.length > 0) return chef.bio;
  let bio = `${chef.name} is`;
  bio += chef.role === 'EXECUTIVE_CHEF' ? ' an ' : ' a ';
  bio += `${CHEF_ROLES[chef.role]} on Recipe Lab. `;
  if (chef.recipeCount > 1) {
    bio += `They have written ${chef.recipeCount} original recipe${
      chef.recipeCount.length > 1 ? 's' : ''
    } `;
    bio += `and contributed to ${chef.modifiedRecipeCount}.`;
  } else {
    bio += 'They have not written any recipes yet :(';
  }
  return bio;
};
