import type { Prize } from '@repo/api-client';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { JoinNowCtaLink } from '@/components/join-now-cta-link';

const PRIZE_MEDAL_IMAGES = [
  '/png/prizes-section-medal-01.png',
  '/png/prizes-section-medal-02.png',
  '/png/prizes-section-medal-03.png',
] as const;

function prizeMedalSrc(
  positionIndex: number,
): (typeof PRIZE_MEDAL_IMAGES)[number] {
  if (positionIndex <= 0) return PRIZE_MEDAL_IMAGES[0];
  if (positionIndex === 1) return PRIZE_MEDAL_IMAGES[1];
  return PRIZE_MEDAL_IMAGES[2];
}

type Props = {
  prizes: Prize[];
};

export async function PrizesSection({ prizes }: Props) {
  const t = await getTranslations('HomePage.prizes');
  const tHome = await getTranslations('HomePage');

  const ordered = [...prizes].sort((a, b) => a.rank - b.rank).slice(0, 3);

  return (
    <section className="bg-white" aria-labelledby="prizes-section-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 pt-32 sm:px-6 md:py-20 md:pt-40 lg:px-8">
        <h2
          id="prizes-section-heading"
          className="font-sofia-sans-condensed mb-12 text-center text-3xl font-normal tracking-wide uppercase md:mb-16 md:text-5xl"
        >
          {t('title')}
        </h2>

        {ordered.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
              {ordered.map((p, index) => (
                <li
                  key={p.id}
                  className="bg-light-gray flex flex-col items-center rounded-2xl px-6 py-10 text-center md:px-8 md:py-12"
                >
                  <div
                    className="relative mb-6 h-[72px] w-[72px] shrink-0"
                    role="img"
                    aria-label={t('medalAriaLabel', { rank: p.rank })}
                  >
                    <Image
                      src={prizeMedalSrc(index)}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="72px"
                    />
                  </div>
                  <p className="font-sofia-sans-condensed mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                    ${p.amount}
                  </p>
                  <p className="text-darkest-gray text-xs leading-snug font-medium uppercase md:text-sm">
                    {p.description ?? t('descriptionFallback')}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-col items-center gap-4 md:mt-16">
              <JoinNowCtaLink href="#application-form">
                {tHome('applicationForm.submit')}
              </JoinNowCtaLink>
              <p className="text-medium-gray text-xxs font-normal md:text-xs">
                {t('termsDisclaimer')}
              </p>
            </div>
          </>
        ) : (
          <p className="text-dark-gray text-center text-sm">{t('empty')}</p>
        )}
      </div>
    </section>
  );
}
