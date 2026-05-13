import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

const DEVICE_SRC = '/png/showcase-section-device.png';

const SHOWCASE_ITEMS = [
  {
    icon: '/png/showcase-section-icon-1.png',
    area: 'slot-a',
    align: 'left' as const,
    translationKey: 'showcase1' as const,
  },
  {
    icon: '/png/showcase-section-icon-2.png',
    area: 'slot-b',
    align: 'left' as const,
    translationKey: 'showcase2' as const,
  },
  {
    icon: '/png/showcase-section-icon-3.png',
    area: 'slot-c',
    align: 'right' as const,
    translationKey: 'showcase3' as const,
  },
  {
    icon: '/png/showcase-section-icon-1.png',
    area: 'slot-d',
    align: 'right' as const,
    translationKey: 'showcase1' as const,
  },
];

export async function ShowcaseSection() {
  const t = await getTranslations('HomePage.showcase');

  return (
    <section
      className="bg-light-gray text-black"
      aria-labelledby="showcase-section-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <h2
          id="showcase-section-heading"
          className="font-sofia-sans-condensed mb-10 text-center text-3xl font-normal tracking-wide uppercase md:mb-20 md:text-5xl"
        >
          {t('title')}
        </h2>

        <div className="showcase-orbit-grid">
          <div className="flex w-full min-w-0 justify-center justify-self-center [grid-area:device]">
            <Image
              src={DEVICE_SRC}
              alt={t('deviceAlt')}
              width={628}
              height={626}
              sizes="(min-width: 1024px) 628px, 100vw"
              className="h-auto w-[628px] max-w-full object-contain"
              priority={false}
            />
          </div>

          {SHOWCASE_ITEMS.map((item) => (
            <article
              key={item.area}
              style={{ gridArea: item.area }}
              className={[
                'flex gap-4',
                'items-center justify-center',
                'text-center md:w-fit md:max-w-[180px] md:flex-col md:items-start md:gap-3 md:text-left',
                item.align === 'left'
                  ? 'md:justify-self-end'
                  : 'md:justify-self-start',
              ].join(' ')}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden md:h-[100px] md:w-[100px]">
                <Image
                  src={item.icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <p className="text-darkest-gray max-w-md text-base leading-relaxed md:text-base">
                {t(item.translationKey)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
