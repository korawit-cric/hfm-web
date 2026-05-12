import { Locale } from '@prisma/client';

import prisma from '../src/index';

async function main() {
  await prisma.linkTranslation.deleteMany();
  await prisma.link.deleteMany();

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
              locale: Locale.en,
              title: item.en.title,
              description: item.en.description,
            },
            {
              locale: Locale.th,
              title: item.th.title,
              description: item.th.description,
            },
          ],
        },
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
