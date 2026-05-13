import { Locale, Prisma } from '@prisma/client';

import prisma from '../src/index';

const L = Locale;

/** Dialing prefixes (E.164 style) and the country each maps to in this seed. */
const PHONE_CODES: { code: string; countryKey: string }[] = [
  { code: '+66', countryKey: 'TH' },
  { code: '+1', countryKey: 'US' },
  { code: '+44', countryKey: 'GB' },
  { code: '+81', countryKey: 'JP' },
  { code: '+65', countryKey: 'SG' },
  { code: '+61', countryKey: 'AU' },
];

const COUNTRIES: { key: string; en: string; th: string }[] = [
  { key: 'TH', en: 'Thailand', th: 'ประเทศไทย' },
  { key: 'US', en: 'United States', th: 'สหรัฐอเมริกา' },
  { key: 'GB', en: 'United Kingdom', th: 'สหราชอาณาจักร' },
  { key: 'JP', en: 'Japan', th: 'ญี่ปุ่น' },
  { key: 'SG', en: 'Singapore', th: 'สิงคโปร์' },
  { key: 'AU', en: 'Australia', th: 'ออสเตรเลีย' },
];

/** Developer skills / seniority for the experience dropdown. */
const EXPERIENCES: { en: string; th: string }[] = [
  { en: 'Student / intern', th: 'นักศึกษา / ฝึกงาน' },
  { en: 'Junior developer (0–2 years)', th: 'นักพัฒนาระดับจูเนียร์ (0–2 ปี)' },
  { en: 'Mid-level developer (2–5 years)', th: 'นักพัฒนาระดับกลาง (2–5 ปี)' },
  { en: 'Senior developer (5+ years)', th: 'นักพัฒนาระดับซีเนียร์ (5+ ปี)' },
  { en: 'Tech lead / architect', th: 'หัวหน้าทางเทคนิค / สถาปนิก' },
];

async function clearAll() {
  await prisma.application.deleteMany();
  await prisma.codeCountry.deleteMany();
  await prisma.linkTranslation.deleteMany();
  await prisma.fqaTranslation.deleteMany();
  await prisma.rankingTranslation.deleteMany();
  await prisma.prizeTranslation.deleteMany();
  await prisma.countryTranslation.deleteMany();
  await prisma.experienceTranslation.deleteMany();
  await prisma.link.deleteMany();
  await prisma.fqa.deleteMany();
  await prisma.ranking.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.code.deleteMany();
  await prisma.country.deleteMany();
  await prisma.experience.deleteMany();
}

async function main() {
  await clearAll();

  const countryIdByKey: Record<string, number> = {};
  for (const c of COUNTRIES) {
    const row = await prisma.country.create({
      data: {
        translations: {
          create: [
            { locale: L.en, name: c.en },
            { locale: L.th, name: c.th },
          ],
        },
      },
    });
    countryIdByKey[c.key] = row.id;
  }

  const codeIdByDial: Record<string, number> = {};
  for (const row of PHONE_CODES) {
    const codeRow = await prisma.code.create({
      data: { code: row.code },
    });
    codeIdByDial[row.code] = codeRow.id;
    await prisma.codeCountry.create({
      data: {
        codeId: codeRow.id,
        countryId: countryIdByKey[row.countryKey]!,
      },
    });
  }

  const experienceIds: number[] = [];
  for (const e of EXPERIENCES) {
    const exp = await prisma.experience.create({
      data: {
        translations: {
          create: [
            { locale: L.en, name: e.en },
            { locale: L.th, name: e.th },
          ],
        },
      },
    });
    experienceIds.push(exp.id);
  }

  const fqaItems: {
    en: { q: string; a: string };
    th: { q: string; a: string };
  }[] = [
    {
      en: {
        q: 'Who can register?',
        a: 'Developers and engineers who meet the eligibility criteria in the official rules.',
      },
      th: {
        q: 'ใครสมัครได้บ้าง?',
        a: 'นักพัฒนาและวิศวกรซอฟต์แวร์ที่ตรงตามเกณฑ์ในประกาศอย่างเป็นทางการ',
      },
    },
    {
      en: {
        q: 'How is ranking calculated?',
        a: 'Ranking uses verified gain amounts; ties may use bonus rules for that round.',
      },
      th: {
        q: 'คำนวณอันดับอย่างไร?',
        a: 'อันดับจากยอด gain ที่ตรวจสอบแล้ว กรณีเท่ากันอาจใช้กติกาโบนัสของรอบนั้น',
      },
    },
    {
      en: {
        q: 'How do I contact support?',
        a: 'Use the official email or help channel on the event website.',
      },
      th: {
        q: 'ติดต่อฝ่ายสนับสนุนอย่างไร?',
        a: 'ใช้อีเมลหรือช่องทางช่วยเหลือที่ระบุบนเว็บไซต์กิจกรรม',
      },
    },
  ];

  for (const item of fqaItems) {
    await prisma.fqa.create({
      data: {
        translations: {
          create: [
            { locale: L.en, q: item.en.q, a: item.en.a },
            { locale: L.th, q: item.th.q, a: item.th.a },
          ],
        },
      },
    });
  }

  const rankingRows: {
    sn: string;
    gain: string;
    bonus: string;
    rank: number;
    en: string;
    th: string;
  }[] = [
    {
      sn: 'R001',
      gain: '158420.75',
      bonus: '12000.00',
      rank: 1,
      en: 'Team Aurora',
      th: 'ทีมออโรรา',
    },
    {
      sn: 'R002',
      gain: '142100.00',
      bonus: '9500.50',
      rank: 2,
      en: 'Binary Builders',
      th: 'ไบนารีบิลเดอร์ส',
    },
    {
      sn: 'R003',
      gain: '128900.25',
      bonus: '8000.00',
      rank: 3,
      en: 'Lambda Labs',
      th: 'แลมดาแล็บส์',
    },
    {
      sn: 'R004',
      gain: '97550.00',
      bonus: '5000.00',
      rank: 4,
      en: 'Pixel Guild',
      th: 'พิกเซิลกิลด์',
    },
    {
      sn: 'R005',
      gain: '88300.50',
      bonus: '4200.00',
      rank: 5,
      en: 'Stack Runners',
      th: 'สแต็กรันเนอร์ส',
    },
  ];

  for (const r of rankingRows) {
    await prisma.ranking.create({
      data: {
        sn: r.sn,
        gain: new Prisma.Decimal(r.gain),
        bonus: new Prisma.Decimal(r.bonus),
        rank: r.rank,
        translations: {
          create: [
            { locale: L.en, name: r.en },
            { locale: L.th, name: r.th },
          ],
        },
      },
    });
  }

  const prizeRows: {
    amount: string;
    rank: number;
    en: string | null;
    th: string | null;
  }[] = [
    {
      amount: '500000.00',
      rank: 1,
      en: 'Champion prize — trophy and cash grant',
      th: 'รางวัลแชมป์ — โทรฟี่และเงินรางวัล',
    },
    {
      amount: '250000.00',
      rank: 2,
      en: 'Runner-up — cash grant',
      th: 'รองแชมป์ — เงินรางวัล',
    },
    {
      amount: '100000.00',
      rank: 3,
      en: 'Third place — cash grant',
      th: 'อันดับที่สาม — เงินรางวัล',
    },
    {
      amount: '25000.00',
      rank: 10,
      en: 'Merit awards for ranks 4–10',
      th: 'รางวัลชมเชยสำหรับอันดับ 4–10',
    },
  ];

  for (const p of prizeRows) {
    await prisma.prize.create({
      data: {
        amount: new Prisma.Decimal(p.amount),
        rank: p.rank,
        translations: {
          create: [
            { locale: L.en, description: p.en },
            { locale: L.th, description: p.th },
          ],
        },
      },
    });
  }

  const linkSeeds = [
    {
      url: 'https://turborepo.com/docs/getting-started/installation',
      en: {
        title: 'Installation',
        description: 'Get started with Turborepo in a few moments',
      },
      th: {
        title: 'การติดตั้ง',
        description: 'เริ่มใช้ Turborepo ได้ในไม่กี่ขั้นตอน',
      },
    },
    {
      url: 'https://turborepo.com/docs/crafting-your-repository',
      en: {
        title: 'Crafting',
        description: 'Architecting a monorepo is a careful process.',
      },
      th: {
        title: 'การออกแบบ',
        description: 'การสร้าง monorepo ต้องใช้ความรอบคอบ',
      },
    },
    {
      url: 'https://turborepo.com/docs/getting-started/add-to-existing-repository',
      en: {
        title: 'Add Repositories',
        description:
          'Turborepo can be incrementally adopted in any repository, single or multi-package, to speed up the developer and CI workflows of the repository.',
      },
      th: {
        title: 'เพิ่มที่เก็บ',
        description:
          'ใช้ Turborepo แบบค่อยเป็นค่อยไปกับที่เก็บเดียวหรือหลายแพ็กเกจ เพื่อเร่งงานพัฒนาและ CI',
      },
    },
  ];

  for (const item of linkSeeds) {
    await prisma.link.create({
      data: {
        url: item.url,
        translations: {
          create: [
            {
              locale: L.en,
              title: item.en.title,
              description: item.en.description,
            },
            {
              locale: L.th,
              title: item.th.title,
              description: item.th.description,
            },
          ],
        },
      },
    });
  }

  await prisma.application.createMany({
    data: [
      {
        firstname: 'Somchai',
        lastname: 'Dev',
        countryId: countryIdByKey.TH!,
        codeId: codeIdByDial['+66']!,
        experienceId: experienceIds[4]!,
        phone: '812345678',
        email: 'somchai.dev@example.com',
        consent: true,
      },
      {
        firstname: 'Jane',
        lastname: 'Smith',
        countryId: countryIdByKey.US!,
        codeId: codeIdByDial['+1']!,
        experienceId: experienceIds[3]!,
        phone: '2025550143',
        email: 'jane.smith@example.com',
        consent: true,
      },
    ],
  });

  console.log('Seed completed: all tables populated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
