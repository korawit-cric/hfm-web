'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { ArrowRight } from '@repo/icons';
import { useCustomForm, FormWrapper } from '@repo/ui/form/form-wrapper';
import { FormInput } from '@repo/ui/form/form-input';
import { FormSelect } from '@repo/ui/form/form-select';
import { FormCheckbox } from '@repo/ui/form/form-checkbox';
import { FormButton } from '@repo/ui/form/form-button';

import type { Country, Experience } from '@repo/api-client';

import { Link } from '@/lib/i18n/navigation';

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
      className="relative isolate flex min-h-[max(774px,100svh)] w-full flex-col items-center justify-center px-4 py-10 sm:px-6 md:py-14 lg:py-16"
      aria-labelledby="application-form-heading"
    >
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/png/application-form-section-background.png')",
        }}
        aria-hidden
      />
      <div className="bg-darkest-gray/65 absolute inset-0 -z-10" aria-hidden />

      <div className="relative z-0 mx-auto flex w-full max-w-6xl flex-col items-center">
        <h2
          id="application-form-heading"
          className="mb-8 max-w-4xl px-2 text-center md:mb-10"
        >
          <span className="text-gold-gradient block text-xl font-bold tracking-wide uppercase sm:text-2xl md:text-3xl lg:text-4xl">
            {t('applicationForm.titleLine1')}
          </span>
          <span className="mt-1 block text-xl font-bold tracking-wide text-white uppercase sm:text-2xl md:text-3xl lg:text-4xl">
            {t('applicationForm.titleLine2')}
          </span>
        </h2>

        <div className="w-full max-w-[640px] rounded-2xl bg-white px-5 py-6 shadow-2xl sm:px-8 sm:py-8 md:max-w-[720px]">
          <h3 className="text-darkest-gray mb-6 text-center text-lg font-bold md:text-xl">
            {t('applicationForm.formTitle')}
          </h3>

          <div className="w-full space-y-4">
            <FormWrapper
              formInstance={form}
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <FormInput
                    name="firstName"
                    label={t('applicationForm.firstName')}
                    required
                    placeholder={t('applicationForm.firstName')}
                  />
                  <FormInput
                    name="lastName"
                    label={t('applicationForm.lastName')}
                    required
                    placeholder={t('applicationForm.lastName')}
                  />
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
                  <div className="w-full min-w-0 flex-1 md:flex-[1.2]">
                    <FormSelect
                      name="countryId"
                      id="application-country-id"
                      label={t('applicationForm.countryLabel')}
                      required
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
                    </FormSelect>
                  </div>
                  <div className="flex w-full gap-4 md:w-auto md:flex-1">
                    <div className="w-24 shrink-0 md:w-28">
                      <FormInput
                        name="phoneCode"
                        label={t('applicationForm.code')}
                        required
                        placeholder="+66"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <FormInput
                        name="phone"
                        label={t('applicationForm.phone')}
                        required
                        type="tel"
                        placeholder={t('applicationForm.phone')}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <FormInput
                    name="email"
                    label={t('applicationForm.email')}
                    required
                    type="email"
                    placeholder={t('applicationForm.email')}
                  />
                  <div>
                    <FormSelect
                      name="experienceId"
                      id="application-experience"
                      label={t('applicationForm.experienceLabel')}
                      required
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
                    </FormSelect>
                  </div>
                </div>

                <div>
                  <FormCheckbox
                    name="acceptTerms"
                    id="application-accept-terms"
                    label={
                      <>
                        {t('applicationForm.acceptTermsLabel')}
                        <Link
                          href="/privacy"
                          className="text-secondary-500 hover:text-secondary-700 font-medium underline"
                        >
                          {t('applicationForm.privacyPolicy')}
                        </Link>
                        {t('applicationForm.and')}
                        <Link
                          href="/terms"
                          className="text-secondary-500 hover:text-secondary-700 font-medium underline"
                        >
                          {t('applicationForm.termsAndConditions')}
                        </Link>
                      </>
                    }
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <FormButton
                    type="submit"
                    variant="primary"
                    size="large"
                    className="w-full min-w-[200px] uppercase sm:w-auto"
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
