export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';

import { getCountries } from '@/features/countries';
import { getExperiences } from '@/features/experiences';
import { getFaqs } from '@/features/faqs';
import { getPrizes } from '@/features/prizes';
import { getRankings } from '@/features/rankings';
import { ApplicationFormSection } from '@/components/application-form-section';
import { FaqSection } from '@/components/faq-section';
import { PrizesSection } from '@/components/prizes-section';
import { RankingSection } from '@/components/ranking-section';
import { ShowcaseSection } from '@/components/showcase-section';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

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
      <ShowcaseSection />
      <PrizesSection prizes={prizes} />
      <RankingSection rankings={rankings} />
      <FaqSection faqs={faqs} />
    </>
  );
}
