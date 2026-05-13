import type { Faq } from '@repo/api-client';
import { getTranslations } from 'next-intl/server';

import { FaqAccordion } from '@/components/faq-accordion';
import { SectionEmptyMessage } from '@/components/section-empty-message';
import { SectionHeader } from '@/components/section-header';

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
        <SectionHeader
          id="faq-section-heading"
          namespace="HomePage.faq"
          translationKey="sectionTitle"
        />
        {faqs.length > 0 ? (
          <FaqAccordion faqs={faqs} />
        ) : (
          <SectionEmptyMessage>{t('empty')}</SectionEmptyMessage>
        )}
      </div>
    </section>
  );
}
