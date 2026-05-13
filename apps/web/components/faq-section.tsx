import type { Faq } from '@repo/api-client';
import { getTranslations } from 'next-intl/server';

import { FaqAccordion } from '@/components/faq-accordion';

type Props = {
  faqs: Faq[];
};

export async function FaqSection({ faqs }: Props) {
  const t = await getTranslations('HomePage.faq');

  return (
    <section
      className="bg-light-gray text-black"
      aria-labelledby="faq-section-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-40 lg:px-8">
        <h2
          id="faq-section-heading"
          className="font-sofia-sans-condensed mb-10 text-center text-3xl font-normal md:mb-20 md:text-5xl"
        >
          {t('sectionTitle')}
        </h2>
        {faqs.length > 0 ? (
          <FaqAccordion faqs={faqs} />
        ) : (
          <p className="text-sm">{t('empty')}</p>
        )}
      </div>
    </section>
  );
}
