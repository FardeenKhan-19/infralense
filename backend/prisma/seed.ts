import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Neon database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@infralense.com' },
    update: {},
    create: {
      email: 'admin@infralense.com',
      password: adminPassword,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  // Create Citizen
  await prisma.user.upsert({
    where: { email: 'citizen@infralense.com' },
    update: {},
    create: {
      email: 'citizen@infralense.com',
      password: userPassword,
      name: 'John Citizen',
      role: 'CITIZEN',
    },
  });

  console.log('✅ Seed data successfully created:');
  console.log('Admin: admin@infralense.com / admin123');
  console.log('Citizen: citizen@infralense.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });