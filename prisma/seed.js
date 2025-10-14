const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const roles = ['ADMIN','USER'];
  for (const name of roles) {
    await prisma.userRole.upsert({ where: { name }, update: {}, create: { name } });
  }
  const types = ['OWNER','CUSTOMER'];
  for (const name of types) {
    await prisma.userType.upsert({ where: { name }, update: {}, create: { name } });
  }

  // create admin placeholder if not exists
  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash('password', 10);
    const adminRole = await prisma.userRole.findUnique({ where: { name: 'ADMIN' } });
    const ownerType = await prisma.userType.findUnique({ where: { name: 'OWNER' } });
    await prisma.user.create({ data: { email: adminEmail, password: hashed, name: 'Admin', roleId: adminRole.id, typeId: ownerType.id } });
    console.log('Created admin user: admin@example.com / password');
  }

  console.log('Seeding finished');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
