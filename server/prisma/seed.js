const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock database data...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password', salt);

  // 1. Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'ROOT-01' },
    update: {},
    create: {
      email: 'ROOT-01',
      passwordHash,
      role: 'SUPER_ADMIN',
      name: 'Root Administrator',
      phone: '0812345678',
    }
  });
  console.log('Super Admin seeded:', superAdmin.email);

  // 2. Create Partner
  const partner = await prisma.user.upsert({
    where: { email: 'P88942' },
    update: {},
    create: {
      email: 'P88942',
      passwordHash,
      role: 'PARTNER_MAIN',
      name: 'สมชาย ใจดี',
      phone: '0898765432',
    }
  });
  console.log('Partner seeded:', partner.email);

  // 3. Create Client Owner
  const clientOwner = await prisma.user.upsert({
    where: { email: 'admin@globaltech.com' },
    update: {},
    create: {
      email: 'admin@globaltech.com',
      passwordHash,
      role: 'CLIENT_OWNER',
      name: 'Client Owner',
      phone: '0865432109',
    }
  });
  console.log('Client Owner seeded:', clientOwner.email);

  // 4. Create Client Workspace for Client Owner
  const client = await prisma.client.create({
    data: {
      name: 'Global Tech Solution',
      ownerId: clientOwner.id,
      plan: 'PRO',
      billingCycle: 'monthly',
      status: 'ACTIVE',
    }
  });
  console.log('Client Workspace seeded:', client.name);

  // 5. Add Client Owner as Admin in team member relation
  await prisma.teamMember.create({
    data: {
      clientId: client.id,
      userId: clientOwner.id,
      role: 'ADMIN'
    }
  });

  // 6. Seed some mock knowledge base entries
  await prisma.knowledge.createMany({
    data: [
      {
        clientId: client.id,
        type: 'TEXT',
        title: 'นโยบายบริษัท',
        content: 'ข้อมูลสรุปของบริษัทประกอบด้วยนโยบายต่างๆ...',
        tokens: 120,
        status: 'TRAINED',
      },
      {
        clientId: client.id,
        type: 'URL',
        title: 'หน้าเว็บ FAQ',
        sourceUrl: 'https://globaltech.com/faq',
        content: 'คำถามที่พบบ่อยเกี่ยวกับการให้บริการลูกค้า...',
        tokens: 300,
        status: 'TRAINED',
      }
    ]
  });
  console.log('Knowledge Base seeded.');

  // 7. Seed some mock leads
  await prisma.lead.createMany({
    data: [
      {
        clientId: client.id,
        name: 'คุณวิชัย รุ่งเรือง',
        contact: '0812223333',
        intent: 'สนใจสมัครบริการ Pro',
        value: 4900,
        stage: 'NEW',
      },
      {
        clientId: client.id,
        name: 'คุณสมจิต รักดี',
        contact: 'somjit@gmail.com',
        intent: 'สอบถามรายละเอียดราคา',
        value: 990,
        stage: 'CONTACTED',
      }
    ]
  });
  console.log('CRM Leads seeded.');

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
