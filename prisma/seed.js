const { prisma } = require('../server/generated/prisma-client');

async function main() {
  await prisma.createUser({
    email: 'jay@schooledlunch.com',
    name: 'Jay',
    password: '$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m' // "secret42"
  });
}

main();
