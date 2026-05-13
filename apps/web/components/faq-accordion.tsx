import type { Faq } from '@repo/api-client';
import { ArrowRight } from '@repo/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/accordion';
import { cn } from '@repo/ui/utils';

type Props = {
  faqs: Faq[];
  defaultValue?: string;
};

export function FaqAccordion({ faqs, defaultValue }: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className="w-full"
    >
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={String(faq.id)}>
          <AccordionTrigger
            className={cn(
              'border-light-border-gray border-b p-5 text-xl font-normal md:p-5',
              'data-[state=open]:border-border-gray data-[state=open]:border-b-2',
              '[&[data-state=open]_svg]:-rotate-90',
            )}
          >
            <span className="min-w-0 flex-1">{faq.q}</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 rotate-90 transition-transform duration-200"
              aria-hidden
            />
          </AccordionTrigger>
          <AccordionContent className="border-light-border-gray border-b text-base font-normal [&>div]:p-5 md:[&>div]:p-5">
            <div className="whitespace-pre-line">{faq.a}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
