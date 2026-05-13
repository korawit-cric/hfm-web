export const dynamic = 'force-dynamic';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ComponentType, SVGProps } from 'react';

import { getCountries } from '@/features/countries';
import { getExperiences } from '@/features/experiences';
import { getFaqs } from '@/features/faqs';
import { getLinks, LinksClient } from '@/features/links';
import { getPrizes, PrizesClient } from '@/features/prizes';
import { getRankings, RankingsClient } from '@/features/rankings';
import { ApplicationFormSection } from '@/components/application-form-section';
import { FaqSection } from '@/components/faq-section';
import { FeatureBadge } from '@/components/feature-badge';
import { ButtonDemo } from '@/components/button-demo';
import { InputDemo } from '@/components/input-demo';
import { TextareaDemo } from '@/components/textarea-demo';
import { FormDemo } from '@/components/form-demo';
import {
  AddFile,
  AddUser,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clear,
  Download,
  Edit,
  Error,
  FullArrowLeft,
  FullArrowRight,
  HamburgerMenu,
  Loading,
  MapPin,
  PhoneCall,
  Search,
  Send,
  Trash,
} from '@repo/icons';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface IconItem {
  name: string;
  component: IconComponent;
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');
  const [links, rankings, faqs, prizes, countries, experiences] =
    await Promise.all([
      getLinks(),
      getRankings(),
      getFaqs(),
      getPrizes(),
      getCountries(),
      getExperiences(),
    ]);

  const icons: IconItem[] = [
    { name: 'AddFile', component: AddFile },
    { name: 'AddUser', component: AddUser },
    { name: 'ArrowLeft', component: ArrowLeft },
    { name: 'ArrowRight', component: ArrowRight },
    { name: 'Calendar', component: Calendar },
    { name: 'Check', component: Check },
    { name: 'Clear', component: Clear },
    { name: 'Download', component: Download },
    { name: 'Edit', component: Edit },
    { name: 'Error', component: Error },
    { name: 'FullArrowLeft', component: FullArrowLeft },
    { name: 'FullArrowRight', component: FullArrowRight },
    { name: 'HamburgerMenu', component: HamburgerMenu },
    { name: 'MapPin', component: MapPin },
    { name: 'PhoneCall', component: PhoneCall },
    { name: 'Search', component: Search },
    { name: 'Send', component: Send },
    { name: 'Trash', component: Trash },
  ];

  return (
    <>
      <ApplicationFormSection countries={countries} experiences={experiences} />
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <main className="w-full max-w-3xl">
          {/* Intro */}
          <h1 className="mb-4 text-3xl font-bold">{t('title')}</h1>
          <p className="text-primary-500 mb-8">{t('intro')}</p>

          {/* Badges */}
          <div className="mb-8 flex flex-wrap gap-2">
            <FeatureBadge label={t('badges.nextjs')} />
            <FeatureBadge label={t('badges.prisma')} />
            <FeatureBadge label={t('badges.localComponent')} highlight />
          </div>

          {/* Button Variants Demo */}
          <ButtonDemo />

          {/* Input Demo */}
          <InputDemo />

          {/* Textarea Demo */}
          <TextareaDemo />

          {/* Form Demo */}
          <FormDemo />

          {/* Icon Showcase */}
          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('iconShowcase.title')}
            </h2>
            <p className="text-foreground/70 mb-6 text-sm">
              {t('iconShowcase.description')}
            </p>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {icons.map(({ name, component: Icon }) => (
                <div
                  key={name}
                  className="flex flex-col items-center rounded-lg p-4 transition-colors"
                >
                  <Icon className="text-primary-600 mb-2 h-5" />
                  <span className="text-desktop-caption text-center">
                    {name}
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center rounded-lg p-4 transition-colors">
                <Loading className="text-primary-600 mb-2 h-5 animate-spin" />
                <span className="text-desktop-caption text-center">
                  {t('iconShowcase.loadingLabel')}
                </span>
              </div>
            </div>
          </section>

          {/* Data */}
          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('serverDemoTitle', { count: links.length })}
            </h2>

            {links.length > 0 ? (
              <ul className="space-y-3">
                {links.map((link) => (
                  <li
                    key={link.id}
                    className="border-surface hover:border-border rounded-xl border p-5 transition-colors"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 font-medium hover:underline"
                    >
                      {link.title}
                    </a>
                    {link.description && (
                      <p className="text-foreground/70 mt-1 text-sm">
                        {link.description}
                      </p>
                    )}
                    <p className="text-foreground/50 mt-2 text-xs">
                      {t('linkMeta', {
                        id: link.id,
                        date: new Date(link.createdAt).toLocaleDateString(
                          locale,
                        ),
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/70">{t('noLinks')}</p>
            )}

            {links.length > 0 && (
              <p className="text-success-800/70 mt-4 text-sm">
                {t('serverFetchNote')}
              </p>
            )}
          </section>

          {/* Client-side fetch demo */}
          <section className="border-surface mt-8 border-t pt-8">
            <h2 className="mb-4 text-xl font-semibold">
              {t('clientDemoTitle')}
            </h2>
            <LinksClient />
          </section>

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

      <FaqSection
        faqs={faqs}
        title={t('faqSectionTitle')}
        emptyLabel={t('noFaqs')}
      />
    </>
  );
}
