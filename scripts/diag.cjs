// Temporary diagnostic: dump SQLite tables + columns via Prisma.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const tables = await prisma.$queryRawUnsafe(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    );
    console.log('TABLES:', JSON.stringify(tables));
    for (const t of tables) {
      const cols = await prisma.$queryRawUnsafe(`PRAGMA table_info("${t.name}")`);
      console.log(t.name + ':', JSON.stringify(cols.map((c) => c.name)));
    }
  } catch (e) {
    console.error('ERR:', e && e.message ? e.message : e);
  } finally {
    await prisma.$disconnect();
  }
})();
