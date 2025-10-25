const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  
  // Create roles
  const roles = [
    { code: 'ADMIN', name: 'Administrator', description: 'Full system access' },
    { code: 'OWNER', name: 'OWNER', description: 'Owner access' },
    { code: 'RENTER', name: 'RENTER', description: 'Renter access' },
    { code: 'GUEST', name: 'GUEST', description: 'Guest access' },
  ];
  
  for (const role of roles) {
    await prisma.role.upsert({ 
      where: { code: role.code }, 
      update: {}, 
      create: role 
    });
  }
  
  // Create user types
  const types = ['OWNER', 'CUSTOMER'];
  for (const name of types) {
    await prisma.userType.upsert({ 
      where: { name }, 
      update: {}, 
      create: { name } 
    });
  }

  // Create admin user if not exists
  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findFirst({ 
    where: { emails: { some: { email: adminEmail } } } 
  });
  
  if (!existing) {
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash('password', 12);
    const adminRole = await prisma.role.findUnique({ where: { code: 'ADMIN' } });
    const ownerType = await prisma.userType.findUnique({ where: { name: 'OWNER' } });
    
    const user = await prisma.user.create({ 
      data: { 
        firstName: 'Admin',
        lastName: 'User',
        password: hashed, 
        userTypeId: ownerType.id,
        emails: {
          create: {
            email: adminEmail,
            isPrimary: true
          }
        }
      } 
    });
    
    // Create user role mapping
    if (adminRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id
        }
      });
    }
    
    console.log('Created admin user: admin@example.com / password');
  }

  console.log('Seeding finished');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
