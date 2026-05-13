import Image from 'next/image';
import type { Ranking } from '@repo/api-client';
import { getTranslations } from 'next-intl/server';

import { JoinNowCtaLink } from '@/components/join-now-cta-link';
import { RankingMoreTable } from '@/components/ranking-more-table';
import { SectionEmptyMessage } from '@/components/section-empty-message';
import { SectionHeader } from '@/components/section-header';

const RANKING_TROPHIES = [
  '/png/ranking-section-trophy-1.png',
  '/png/ranking-section-trophy-2.png',
  '/png/ranking-section-trophy-3.png',
] as const;

function trophyForPlace(index: number): (typeof RANKING_TROPHIES)[number] {
  if (index <= 0) return RANKING_TROPHIES[0];
  if (index === 1) return RANKING_TROPHIES[1];
  return RANKING_TROPHIES[2];
}

type Props = {
  rankings: Ranking[];
};

export async function RankingSection({ rankings }: Props) {
  const [t, tHome] = await Promise.all([
    getTranslations('HomePage.rankingSection'),
    getTranslations('HomePage'),
  ]);

  const sorted = [...rankings].sort((a, b) => a.rank - b.rank);
  const topThree = sorted.slice(0, 3);
  const moreRanks = sorted.slice(3, 13);

  const winnerLabels = [t('winner1'), t('winner2'), t('winner3')] as const;

  return (
    <section id="rankings-section" aria-labelledby="ranking-section-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeader
          id="ranking-section-heading"
          namespace="HomePage.rankingSection"
          translationKey="title"
        />

        {sorted.length === 0 ? (
          <SectionEmptyMessage>{t('empty')}</SectionEmptyMessage>
        ) : (
          <>
            <div className="flex flex-col gap-12 rounded-[20px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-14">
              <div className="flex flex-col gap-5">
                {topThree.map((r, i) => (
                  <article
                    key={r.id}
                    className="flex gap-4 rounded-xl bg-white p-5 text-black md:gap-8 md:p-[30px]"
                  >
                    <div className="relative h-16 w-16 shrink-0 self-center md:h-[100px] md:w-[100px]">
                      <Image
                        src={trophyForPlace(i)}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(min-width: 768px) 100px, 80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-6 text-left">
                      <p className="text-gold-gradient font-bold tracking-wide uppercase md:text-lg">
                        {winnerLabels[Math.min(i, 2)]}
                      </p>
                      <div className="flex flex-col gap-0">
                        <p className="leading-tight font-normal uppercase md:text-lg">
                          {r.name}
                        </p>
                        <p className="text-subtitle-gray leading-tight font-normal md:text-lg">
                          {r.sn}
                        </p>
                      </div>
                      <p className="font-bold md:text-lg">
                        {t('totalGainPrefix')}{' '}
                        <span className="text-secondary-500 text-lg font-bold">
                          {r.gain}%
                        </span>
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div>
                <h3 className="mb-16 text-2xl font-bold">
                  {t('moreRanksTitle')}
                </h3>
                <RankingMoreTable rows={moreRanks} />
                <p className="text-medium-gray text-xxs mt-4 font-normal md:text-xs">
                  {t('moreRanksFootnote')}
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 md:mt-16">
              <JoinNowCtaLink href="#application-form">
                {tHome('applicationForm.submit')}
              </JoinNowCtaLink>
              <p className="text-medium-gray text-xxs font-normal md:text-xs">
                {t('tableRemark')}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
