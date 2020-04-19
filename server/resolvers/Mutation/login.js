const { compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const createModification = require('../../utils/createModification');

module.exports = async (parent, { email, password, modifications }, ctx) => {
  const user = await ctx.prisma.user({ email });
  const recipeModsCreated = [];
  const recipeModsInConflict = [];
  if (!user) {
    throw new Error(`No user found for email: ${email}`);
  }

  const passwordValid = await compare(password, user.password);
  if (!passwordValid) {
    throw new Error('Invalid password');
  }

  if (modifications) {
    await Promise.all(
      modifications.map(async ({ recipeId, ...modification }) => {
        const modExists = await ctx.prisma.$exists.modification({
          user: { id: user.id },
          recipe: { uid: recipeId },
        });
        if (!modExists) {
          await createModification(ctx, recipeId, user.id, modification);
          recipeModsCreated.push(recipeId);
        } else {
          recipeModsInConflict.push(recipeId);
        }
      })
    );
  }

  const token = sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user,
    recipeModsCreated,
    recipeModsInConflict,
  };
};
