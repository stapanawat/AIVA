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
    update: {
      name: 'สมชาย ใจดี',
      phone: '0898765432',
    },
    create: {
      email: 'P88942',
      passwordHash,
      role: 'PARTNER_MAIN',
      name: 'สมชาย ใจดี',
      phone: '0898765432',
    }
  });
  console.log('Partner seeded:', partner.email);

  const partner2 = await prisma.user.upsert({
    where: { email: 'P11223' },
    update: {
      name: 'บจก. มาร์เก็ตติ้ง จำกัด',
      phone: '021234567',
    },
    create: {
      email: 'P11223',
      passwordHash,
      role: 'PARTNER_MAIN',
      name: 'บจก. มาร์เก็ตติ้ง จำกัด',
      phone: '021234567',
    }
  });
  console.log('Partner 2 seeded:', partner2.email);

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
  
  // 8. Seed Referrals for Main Partner P88942
  const mainPartner = await prisma.user.findUnique({ where: { email: 'P88942' } });
  
  const refFb = await prisma.referral.upsert({
    where: { code: 'FB_ADS' },
    update: {},
    create: {
      partnerId: mainPartner.id,
      name: 'ยิงแอด FB',
      code: 'FB_ADS',
      clicks: 540,
      signups: 25
    }
  });

  const refTiktok = await prisma.referral.upsert({
    where: { code: 'TIKTOK' },
    update: {},
    create: {
      partnerId: mainPartner.id,
      name: 'แชร์วิดีโอ TikTok',
      code: 'TIKTOK',
      clicks: 230,
      signups: 10
    }
  });

  // 9. Seed Referred Clients for P88942 (to reach 18% tier)
  // Let's create 18 clients under P88942's FB_ADS to generate realistic LTV volume
  // Total target volume around 125,400 (e.g. 20 clients with PRO plan = 98,000, 2 clients with ADVANCED = 23,800, 4 clients with BASIC = 3,960 -> 125,760)
  const plans = ['PRO', 'PRO', 'PRO', 'ADVANCED', 'BASIC', 'PRO', 'PRO', 'PRO', 'BASIC', 'PRO'];
  for (let i = 0; i < plans.length; i++) {
    const email = `referred_client_${i}@gmail.com`;
    const clientUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: 'CLIENT_OWNER',
        name: `คุณลูกค้า แนะนำ_${i}`,
        referralCode: 'FB_ADS'
      }
    });

    const clientBrand = await prisma.client.create({
      data: {
        name: `แบรนด์แนะนำที่_${i}`,
        ownerId: clientUser.id,
        plan: plans[i],
        billingCycle: 'monthly',
        status: 'ACTIVE'
      }
    });

    await prisma.teamMember.create({
      data: {
        clientId: clientBrand.id,
        userId: clientUser.id,
        role: 'ADMIN'
      }
    });
  }

  // Also seed some DIRECT clients under mainPartner id directly
  const directUser1 = await prisma.user.upsert({
    where: { email: 'direct_client_1@gmail.com' },
    update: {},
    create: {
      email: 'direct_client_1@gmail.com',
      passwordHash,
      role: 'CLIENT_OWNER',
      name: 'คุณวิชัย รุ่งเรือง',
      referralCode: 'P88942'
    }
  });

  const directBrand1 = await prisma.client.create({
    data: {
      name: 'บจก. รุ่งเรือง การค้า',
      ownerId: directUser1.id,
      plan: 'ADVANCED', // 11,900
      billingCycle: 'monthly',
      status: 'ACTIVE'
    }
  });

  await prisma.teamMember.create({
    data: {
      clientId: directBrand1.id,
      userId: directUser1.id,
      role: 'ADMIN'
    }
  });

  // 10. Seed Sub-Partner SP99201 under P88942
  const subPartner = await prisma.user.upsert({
    where: { email: 'SP99201' },
    update: {},
    create: {
      email: 'SP99201',
      passwordHash,
      role: 'PARTNER_SUB',
      name: 'นพดล มั่งคั่ง',
      phone: '0811122233',
      referralCode: 'P88942' // Referred by main partner P88942
    }
  });

  const refSub = await prisma.referral.upsert({
    where: { code: 'SUB_FB' },
    update: {},
    create: {
      partnerId: subPartner.id,
      name: 'แนะนำตรง Sub-Partner',
      code: 'SUB_FB',
      clicks: 120,
      signups: 5
    }
  });

  // Seed clients for sub-partner SP99201 (e.g. 5 PRO clients = 24,500, 3 ADVANCED = 35,700 -> 60,200 -> Tier 10% sub commission rate)
  const subPlans = ['PRO', 'PRO', 'ADVANCED', 'PRO', 'ADVANCED', 'PRO'];
  for (let i = 0; i < subPlans.length; i++) {
    const email = `sub_referred_client_${i}@gmail.com`;
    const clientUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: 'CLIENT_OWNER',
        name: `ลูกค้าของตัวแทนย่อย_${i}`,
        referralCode: 'SUB_FB'
      }
    });

    const clientBrand = await prisma.client.create({
      data: {
        name: `แบรนด์ตัวแทนย่อยที่_${i}`,
        ownerId: clientUser.id,
        plan: subPlans[i],
        billingCycle: 'monthly',
        status: 'ACTIVE'
      }
    });

    await prisma.teamMember.create({
      data: {
        clientId: clientBrand.id,
        userId: clientUser.id,
        role: 'ADMIN'
      }
    });
  }

  // 11. Seed Payouts History for P88942
  // Let's create an approved payout and a pending payout
  await prisma.payout.createMany({
    data: [
      {
        partnerId: mainPartner.id,
        amount: 38800,
        status: 'APPROVED',
        requestedAt: new Date('2026-05-01T10:00:00Z'),
        paidAt: new Date('2026-05-05T14:30:00Z')
      },
      {
        partnerId: mainPartner.id,
        amount: 21895,
        status: 'PENDING',
        requestedAt: new Date('2026-06-01T09:15:00Z')
      }
    ]
  });

  console.log('Referrals, Sub-Partners, referred clients, and payouts seeded.');
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
