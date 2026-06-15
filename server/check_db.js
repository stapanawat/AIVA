const { PrismaClient } = require('@prisma/client');

const dbUrl = process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'connection_limit=1';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

async function main() {
  const result = await prisma.knowledge.deleteMany({
    where: {
      title: {
        startsWith: 'นโยบายการคืนสินค้า'
      }
    }
  });
  console.log(`Successfully cleaned up ${result.count} duplicate test entries.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
