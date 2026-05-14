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

/** Investment / trading experience for the experience dropdown. */
const EXPERIENCES: { en: string; th: string }[] = [
  { en: 'New to investing', th: 'เพิ่งเริ่มลงทุน' },
  { en: 'Beginner (under 1 year)', th: 'มือใหม่ (ไม่ถึง 1 ปี)' },
  { en: 'Intermediate (1–3 years)', th: 'ระดับกลาง (1–3 ปี)' },
  { en: 'Experienced (3–5 years)', th: 'มีประสบการณ์ (3–5 ปี)' },
  { en: 'Advanced (5+ years)', th: 'ระดับสูง (5+ ปี)' },
];

async function clearAll() {
  await prisma.application.deleteMany();
  await prisma.codeCountry.deleteMany();
  await prisma.fqaTranslation.deleteMany();
  await prisma.rankingTranslation.deleteMany();
  await prisma.prizeTranslation.deleteMany();
  await prisma.countryTranslation.deleteMany();
  await prisma.experienceTranslation.deleteMany();
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
        q: 'Who can open a trading account?',
        a: 'Retail clients who meet age, residency, and identity verification requirements set out in our official terms and product rules.',
      },
      th: {
        q: 'ใครสามารถเปิดบัญชีเทรดได้?',
        a: 'ลูกค้ารายย่อยที่มีอายุ ที่อยู่ และการยืนยันตัวตนครบถ้วนตามเงื่อนไขในข้อกำหนดและกฎผลิตภัณฑ์อย่างเป็นทางการ',
      },
    },
    {
      en: {
        q: 'How is the rankings leaderboard calculated?',
        a: 'Rankings use verified trading results (such as published gain figures). Tie-breakers follow the rules announced for that competition round.',
      },
      th: {
        q: 'คำนวณอันดับบนลีดเดอร์บอร์ดอย่างไร?',
        a: 'อันดับอิงผลการเทรดที่ตรวจสอบแล้ว (เช่น ตัวเลขกำไรที่ประกาศ) กรณีคะแนนเท่ากันให้เป็นไปตามกติกาของรอบแข่งขันนั้น',
      },
    },
    {
      en: {
        q: 'How do I contact trading support?',
        a: 'Use live chat, the official support email, or the help centre linked from the HFM website and client portal.',
      },
      th: {
        q: 'ติดต่อฝ่ายสนับสนุนการเทรดอย่างไร?',
        a: 'ใช้แชทสด อีเมลซัพพอร์ตทางการ หรือศูนย์ช่วยเหลือจากเว็บไซต์ HFM และพอร์ทัลลูกค้า',
      },
    },
    {
      en: {
        q: 'What are the risks of trading?',
        a: 'Trading carries a risk of loss; leverage increases both potential profit and loss. Use only risk capital and read our risk disclosure before you trade.',
      },
      th: {
        q: 'ความเสี่ยงของการเทรดมีอะไรบ้าง?',
        a: 'การเทรดมีความเสี่ยงขาดทุน เลเวอเรจขยายทั้งกำไรและขาดทุน ใช้เงินที่ยอมรับความเสี่ยงได้และอ่านคำเปิดเผยความเสี่ยงก่อนเทรด',
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
      sn: '0000000001',
      gain: '158420.75',
      bonus: '12000.00',
      rank: 1,
      en: 'Chananya V.',
      th: 'ชนัญญา วี.',
    },
    {
      sn: '0000000002',
      gain: '142100.00',
      bonus: '9500.50',
      rank: 2,
      en: 'Marcus T.',
      th: 'มาร์คัส ที.',
    },
    {
      sn: '0000000003',
      gain: '128900.25',
      bonus: '8000.00',
      rank: 3,
      en: 'Sita K.',
      th: 'สิตา ก.',
    },
    {
      sn: '0000000004',
      gain: '97550.00',
      bonus: '5000.00',
      rank: 4,
      en: 'Alex R.',
      th: 'อเล็กซ์ อาร์.',
    },
    {
      sn: '0000000005',
      gain: '88300.50',
      bonus: '4200.00',
      rank: 5,
      en: 'Niran P.',
      th: 'นิรันดร์ พ.',
    },
    {
      sn: '0000000006',
      gain: '79240.00',
      bonus: '3800.00',
      rank: 6,
      en: 'Priya S.',
      th: 'ปริยา เอส.',
    },
    {
      sn: '0000000007',
      gain: '71080.25',
      bonus: '3400.00',
      rank: 7,
      en: 'James L.',
      th: 'เจมส์ แอล.',
    },
    {
      sn: '0000000008',
      gain: '63820.00',
      bonus: '3000.00',
      rank: 8,
      en: 'Lin W.',
      th: 'หลิน ดับบลิว.',
    },
    {
      sn: '0000000009',
      gain: '57440.50',
      bonus: '2700.00',
      rank: 9,
      en: 'David K.',
      th: 'เดวิด เค.',
    },
    {
      sn: '0000000010',
      gain: '51650.00',
      bonus: '2400.00',
      rank: 10,
      en: 'Araya M.',
      th: 'อารยา เอ็ม.',
    },
    {
      sn: '0000000011',
      gain: '46485.75',
      bonus: '2100.00',
      rank: 11,
      en: 'Tom H.',
      th: 'ทอม เอช.',
    },
    {
      sn: '0000000012',
      gain: '41810.25',
      bonus: '1900.00',
      rank: 12,
      en: 'Omar F.',
      th: 'โอมาร์ เอฟ.',
    },
    {
      sn: '0000000013',
      gain: '37605.00',
      bonus: '1700.00',
      rank: 13,
      en: 'Nina B.',
      th: 'นีนา บี.',
    },
    {
      sn: '0000000014',
      gain: '33815.50',
      bonus: '1500.00',
      rank: 14,
      en: 'Ken Y.',
      th: 'เคน วาย.',
    },
    {
      sn: '0000000015',
      gain: '30395.00',
      bonus: '1300.00',
      rank: 15,
      en: 'Zoe C.',
      th: 'โซอี ซี.',
    },
    {
      sn: '0000000016',
      gain: '27320.75',
      bonus: '1100.00',
      rank: 16,
      en: 'Pat N.',
      th: 'แพ็ต เอ็น.',
    },
    {
      sn: '0000000017',
      gain: '24560.00',
      bonus: '1000.00',
      rank: 17,
      en: 'Joy T.',
      th: 'จอย ที.',
    },
    {
      sn: '0000000018',
      gain: '21955.25',
      bonus: '900.00',
      rank: 18,
      en: 'Max G.',
      th: 'แม็กซ์ จี.',
    },
    {
      sn: '0000000019',
      gain: '19615.50',
      bonus: '800.00',
      rank: 19,
      en: 'Ann R.',
      th: 'แอน อาร์.',
    },
    {
      sn: '0000000020',
      gain: '17625.00',
      bonus: '700.00',
      rank: 20,
      en: 'Ben Q.',
      th: 'เบ็น คิว.',
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
