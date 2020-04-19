const { verify } = require('jsonwebtoken');

module.exports = (ctx) => {
  const Authorization = ctx.request.get('Authorization');
  if (!Authorization) throw new Error('No auth headers found');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, process.env.APP_SECRET);
    return verifiedToken && verifiedToken.userId;
  }
};
