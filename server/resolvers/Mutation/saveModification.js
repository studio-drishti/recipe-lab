const createModification = require('../../utils/createModification');
const updateModification = require('../../utils/updateModification');

module.exports = async (parent, { userId, recipeId, ...modification }, ctx) => {
  const mod = await ctx.prisma
    .modifications({
      where: { recipe: { uid: recipeId }, user: { id: userId } },
    })
    .then((mods) => mods.shift());

  return mod
    ? await updateModification(ctx, mod.id, modification)
    : await createModification(ctx, recipeId, userId, modification);
};
