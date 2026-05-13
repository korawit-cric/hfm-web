'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { ArrowRight } from '@repo/icons';
import { useCustomForm, FormWrapper } from '@repo/ui/form/form-wrapper';
import { FormInput } from '@repo/ui/form/form-input';
import { FormDropdownSelect } from '@repo/ui/form/form-dropdown-select';
import { FormCheckbox } from '@repo/ui/form/form-checkbox';
import { FormButton } from '@repo/ui/form/form-button';

import type { Country, Experience } from '@repo/api-client';

import { Link } from '@/lib/i18n/navigation';

/** Phone row: full width of each column, same height as default fields. */
const PHONE_FIELD_CONTROL = 'h-[42px] w-full min-w-0';

function buildSchema(t: (key: string) => string) {
  const req = () => t('applicationForm.errors.required');
  const emailInvalid = () => t('applicationForm.errors.email');
  const accept = () => t('applicationForm.errors.acceptTerms');

  return z.object({
    firstName: z.string().min(1, req()),
    lastName: z.string().min(1, req()),
    countryId: z.string().min(1, req()),
    phoneCode: z.string().min(1, req()),
    phone: z.string().min(1, req()),
    email: z.string().min(1, req()).email(emailInvalid()),
    experienceId: z.string().min(1, req()),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: accept(),
    }),
  });
}

export type ApplicationFormValues = z.infer<ReturnType<typeof buildSchema>>;

type Props = {
  countries: Country[];
  experiences: Experience[];
};

export function ApplicationFormSection({ countries, experiences }: Props) {
  const t = useTranslations('HomePage');
  const [submittedData, setSubmittedData] =
    useState<ApplicationFormValues | null>(null);

  const schema = useMemo(() => buildSchema(t), [t]);

  const form = useCustomForm<ApplicationFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      countryId: '',
      phoneCode: '',
      phone: '',
      email: '',
      experienceId: '',
      acceptTerms: false,
    },
    schema,
    mode: 'onSubmit',
  });

  const countriesById = useMemo(
    () => new Map(countries.map((c) => [String(c.id), c])),
    [countries],
  );

  const { setValue } = form;

  const selectChevron = (
    <ArrowRight className="text-medium-gray h-4 w-4 rotate-90" aria-hidden />
  );

  const handleSubmit = (data: ApplicationFormValues) => {
    setSubmittedData(data);
    setTimeout(() => {
      form.reset();
      setSubmittedData(null);
    }, 3000);
  };

  return (
    <section
      className="relative isolate flex min-h-[max(774px,100svh)] w-full flex-col items-center justify-center px-4 py-10 md:py-12"
      aria-labelledby="application-form-heading"
    >
      <div
        className="absolute inset-0 -z-20 bg-[url('/png/application-form-section-background.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      <div className="relative z-0 mx-auto flex w-full max-w-6xl flex-col items-center">
        <h2
          id="application-form-heading"
          className="mb-8 max-w-4xl px-2 text-center md:mb-10"
        >
          <span className="text-gold-gradient font-sofia-sans-condensed block text-4xl font-bold tracking-wide uppercase md:text-7xl">
            {t('applicationForm.titleLine1')}
          </span>
          <span className="font-sofia-sans-condensed mt-1 block text-4xl font-bold tracking-wide text-white uppercase md:text-7xl">
            {t('applicationForm.titleLine2')}
          </span>
        </h2>

        <div className="flex min-h-[437px] w-full max-w-[730px] flex-col items-center justify-center overflow-y-auto rounded-[10px] bg-white p-6 shadow-2xl md:p-10">
          <h3 className="text-darkest-gray mb-8 text-center text-lg font-bold md:text-xl">
            {t('applicationForm.formTitle')}
          </h3>

          <div className="w-full">
            <FormWrapper
              formInstance={form}
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div className="flex flex-col [&>*:not(:last-child):not(:nth-last-child(3)):not(:nth-last-child(2))]:mb-4 [&>*:nth-last-child(2)]:mb-10 [&>*:nth-last-child(3)]:mb-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <FormInput
                    name="firstName"
                    placeholder={t('applicationForm.firstName')}
                  />
                  <FormInput
                    name="lastName"
                    placeholder={t('applicationForm.lastName')}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
                  <div className="min-w-0">
                    <FormDropdownSelect
                      name="countryId"
                      id="application-country-id"
                      icon={selectChevron}
                      onSelectChange={(e) => {
                        const id = e.target.value;
                        if (!id) {
                          setValue('phoneCode', '');
                          return;
                        }
                        const country = countriesById.get(id);
                        if (country?.phoneCode) {
                          setValue('phoneCode', country.phoneCode);
                        }
                      }}
                    >
                      <option value="" disabled>
                        {t('applicationForm.countryPlaceholder')}
                      </option>
                      {countries.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name}
                        </option>
                      ))}
                    </FormDropdownSelect>
                  </div>
                  <div className="flex min-w-0 gap-4">
                    <div className="w-18">
                      <FormInput
                        name="phoneCode"
                        placeholder={t('applicationForm.code')}
                        controlClassName={PHONE_FIELD_CONTROL}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <FormInput
                        name="phone"
                        type="tel"
                        placeholder={t('applicationForm.phone')}
                        controlClassName={PHONE_FIELD_CONTROL}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <FormInput
                    name="email"
                    type="email"
                    placeholder={t('applicationForm.email')}
                  />
                  <div>
                    <FormDropdownSelect
                      name="experienceId"
                      id="application-experience"
                      icon={selectChevron}
                    >
                      <option value="" disabled>
                        {t('applicationForm.experiencePlaceholder')}
                      </option>
                      {experiences.map((exp) => (
                        <option key={exp.id} value={String(exp.id)}>
                          {exp.name}
                        </option>
                      ))}
                    </FormDropdownSelect>
                  </div>
                </div>

                <FormCheckbox
                  name="acceptTerms"
                  id="application-accept-terms"
                  label={
                    <div className="text-gray flex items-center gap-1 text-xs">
                      {t('applicationForm.acceptTermsLabel')}
                      <Link
                        href="/privacy"
                        className="text-secondary-500! hover:text-secondary-700 font-normal hover:underline!"
                      >
                        {t('applicationForm.privacyPolicy')}
                      </Link>
                      {t('applicationForm.and')}
                      <Link
                        href="/terms"
                        className="text-secondary-500! hover:text-secondary-700 font-normal hover:underline!"
                      >
                        {t('applicationForm.termsAndConditions')}
                      </Link>
                    </div>
                  }
                />

                <div className="flex justify-center">
                  <FormButton
                    type="submit"
                    variant="primary"
                    size="large"
                    className="w-full min-w-[307px] uppercase md:w-auto"
                    autoDisable={false}
                  >
                    {t('applicationForm.submit')}
                  </FormButton>
                </div>
              </div>
            </FormWrapper>

            {submittedData ? (
              <div className="bg-success-100 border-success-800 rounded-lg border p-4">
                <p className="text-success-800 mb-2 text-sm font-medium">
                  {t('applicationForm.submitSuccess')}
                </p>
                <pre className="text-success-800 overflow-auto text-xs">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
