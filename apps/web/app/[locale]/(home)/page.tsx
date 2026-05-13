export const dynamic = 'force-dynamic';

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getCountries } from '@/features/countries';
import { getExperiences } from '@/features/experiences';
import { getFaqs } from '@/features/faqs';
import { getPrizes, PrizesClient } from '@/features/prizes';
import { getRankings, RankingsClient } from '@/features/rankings';
import { ApplicationFormSection } from '@/components/application-form-section';
import { FaqSection } from '@/components/faq-section';
import { FeatureBadge } from '@/components/feature-badge';
import { ShowcaseSection } from '@/components/showcase-section';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');
  const [rankings, faqs, prizes, countries, experiences] = await Promise.all([
    getRankings(),
    getFaqs(),
    getPrizes(),
    getCountries(),
    getExperiences(),
  ]);

  return (
    <>
      <ApplicationFormSection countries={countries} experiences={experiences} />
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <main className="w-full max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold">{t('title')}</h1>
          <p className="text-primary-500 mb-8">{t('intro')}</p>

          <div className="mb-8 flex flex-wrap gap-2">
            <FeatureBadge label={t('badges.nextjs')} />
            <FeatureBadge label={t('badges.prisma')} />
            <FeatureBadge label={t('badges.localComponent')} highlight />
          </div>

          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('rankingsServerTitle', { count: rankings.length })}
            </h2>
            {rankings.length > 0 ? (
              <ul className="space-y-3">
                {rankings.map((r) => (
                  <li
                    key={r.id}
                    className="border-surface hover:border-border rounded-xl border p-5 transition-colors"
                  >
                    <p className="font-medium">
                      #{r.rank} {r.name}
                    </p>
                    <p className="text-foreground/70 mt-1 text-sm">{r.sn}</p>
                    <p className="text-foreground/50 mt-2 text-xs">
                      {t('rankingMeta', { rank: r.rank, gain: r.gain })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/70">{t('noRankings')}</p>
            )}
          </section>

          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('rankingsClientTitle')}
            </h2>
            <RankingsClient />
          </section>

          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('prizesServerTitle', { count: prizes.length })}
            </h2>
            {prizes.length > 0 ? (
              <ul className="space-y-3">
                {prizes.map((p) => (
                  <li
                    key={p.id}
                    className="border-surface rounded-xl border p-5 transition-colors"
                  >
                    <p className="font-medium">
                      {t('prizeLine', { rank: p.rank, amount: p.amount })}
                    </p>
                    {p.description && (
                      <p className="text-foreground/70 mt-2 text-sm">
                        {p.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/70">{t('noPrizes')}</p>
            )}
          </section>

          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('prizesClientTitle')}
            </h2>
            <PrizesClient />
          </section>
        </main>
      </div>

      <ShowcaseSection />

      <FaqSection faqs={faqs} />
    </>
  );
}
