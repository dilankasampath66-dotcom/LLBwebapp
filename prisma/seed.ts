import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Super Admin
  const superAdminEmail = 'superadmin@ousl.lk';
  const superAdminPassword = await bcrypt.hash('Admin@1234', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: superAdminEmail,
      phone: '0000000000',
      passwordHash: superAdminPassword,
      studyYear: 6,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`Super admin created/verified with id: ${superAdmin.id}`);

  // 2. Seed Subjects
  const subjects = [
    // Level 3
    { name: 'Legal System of Sri Lanka', level: 3 },
    { name: 'Law of Contract', level: 3 },
    { name: 'Criminal Law', level: 3 },
    { name: 'Constitutional Law', level: 3 },
    // Level 4
    { name: 'Law of Delict', level: 4 },
    { name: 'Company Law', level: 4 },
    { name: 'Family Law', level: 4 },
    { name: 'Administrative Law', level: 4 },
    // Level 5
    { name: 'International Law', level: 5 },
    { name: 'Environmental Law', level: 5 },
    { name: 'Labour Law', level: 5 },
    { name: 'Intellectual Property Law', level: 5 },
    // Level 6
    { name: 'Tax Law', level: 6 },
    { name: 'Banking Law', level: 6 },
    { name: 'Land Law', level: 6 },
    { name: 'Human Rights Law', level: 6 },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: {
        name_level: {
          name: subject.name,
          level: subject.level,
        },
      },
      update: {},
      create: subject,
    });
  }
  console.log('Subjects seeded successfully.');

  // 3. Initial Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      homepageHeadline: 'OUSL Law Student Portal',
      homepageSubtext: 'Access study materials, lecture videos, and landmark judgements',
    },
  });
  console.log('Site settings initialized.');

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
