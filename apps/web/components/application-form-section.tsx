'use client';

import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { ArrowRight, Error as ErrorIcon } from '@repo/icons';
import { useCustomForm, FormWrapper } from '@repo/ui/form/form-wrapper';
import { FormInput } from '@repo/ui/form/form-input';
import { FormButton } from '@repo/ui/form/form-button';
import { cn } from '@repo/ui/utils';

import { Link } from '@/lib/i18n/navigation';

const labelClassName = 'mb-2 block text-xs font-bold text-bold-gray md:text-sm';

const selectBaseClassName = cn(
  'h-14 w-full cursor-pointer rounded-lg border bg-white px-4 pr-10 text-base text-darkest-gray transition-all duration-200',
  'border border-medium-gray hover:border-primary-300 focus:border-2 focus:border-primary-400 focus:outline-none',
  'appearance-none',
);

function buildSchema(t: (key: string) => string) {
  const req = () => t('applicationForm.errors.required');
  const emailInvalid = () => t('applicationForm.errors.email');
  const accept = () => t('applicationForm.errors.acceptTerms');

  return z.object({
    firstName: z.string().min(1, req()),
    lastName: z.string().min(1, req()),
    country: z.string().min(1, req()),
    phoneCode: z.string().min(1, req()),
    phone: z.string().min(1, req()),
    email: z.string().min(1, req()).email(emailInvalid()),
    experience: z.string().min(1, req()),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: accept(),
    }),
  });
}

export type ApplicationFormValues = z.infer<ReturnType<typeof buildSchema>>;

export function ApplicationFormSection() {
  const t = useTranslations('HomePage');
  const [submittedData, setSubmittedData] =
    useState<ApplicationFormValues | null>(null);

  const schema = useMemo(() => buildSchema(t), [t]);

  const form = useCustomForm<ApplicationFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      phoneCode: '',
      phone: '',
      email: '',
      experience: '',
      acceptTerms: false,
    },
    schema,
  });

  const {
    control,
    formState: { errors },
  } = form;

  const selectErrorClass = (name: keyof ApplicationFormValues) =>
    errors[name] ? 'border-2 border-error-300' : '';

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
                    <label
                      htmlFor="application-country"
                      className={labelClassName}
                    >
                      {t('applicationForm.countryLabel')}
                      <span
                        className="text-error-500 ml-1"
                        aria-label="required"
                      >
                        *
                      </span>
                    </label>
                    <div className="relative">
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="application-country"
                            aria-invalid={errors.country ? 'true' : 'false'}
                            className={cn(
                              selectBaseClassName,
                              selectErrorClass('country'),
                            )}
                          >
                            <option value="" disabled>
                              {t('applicationForm.countryPlaceholder')}
                            </option>
                            <option value="TH">
                              {t('applicationForm.countryTH')}
                            </option>
                            <option value="US">
                              {t('applicationForm.countryUS')}
                            </option>
                            <option value="GB">
                              {t('applicationForm.countryGB')}
                            </option>
                          </select>
                        )}
                      />
                      <ArrowRight
                        className="text-medium-gray pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90"
                        aria-hidden
                      />
                    </div>
                    {errors.country?.message ? (
                      <p className="text-error-500 mt-2 text-xs md:text-sm">
                        {String(errors.country.message)}
                      </p>
                    ) : null}
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
                    <label
                      htmlFor="application-experience"
                      className={labelClassName}
                    >
                      {t('applicationForm.experienceLabel')}
                      <span
                        className="text-error-500 ml-1"
                        aria-label="required"
                      >
                        *
                      </span>
                    </label>
                    <div className="relative">
                      <Controller
                        name="experience"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="application-experience"
                            aria-invalid={errors.experience ? 'true' : 'false'}
                            className={cn(
                              selectBaseClassName,
                              selectErrorClass('experience'),
                            )}
                          >
                            <option value="" disabled>
                              {t('applicationForm.experiencePlaceholder')}
                            </option>
                            <option value="beginner">
                              {t('applicationForm.expBeginner')}
                            </option>
                            <option value="intermediate">
                              {t('applicationForm.expIntermediate')}
                            </option>
                            <option value="advanced">
                              {t('applicationForm.expAdvanced')}
                            </option>
                          </select>
                        )}
                      />
                      <ArrowRight
                        className="text-medium-gray pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90"
                        aria-hidden
                      />
                    </div>
                    {errors.experience?.message ? (
                      <p className="text-error-500 mt-2 text-xs md:text-sm">
                        {String(errors.experience.message)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Controller
                    name="acceptTerms"
                    control={control}
                    render={({ field }) => (
                      <label className="text-darkest-gray flex cursor-pointer items-start gap-3 text-sm md:text-base">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          className="text-primary-500 focus:ring-primary-400 border-medium-gray mt-0.5 h-5 w-5 shrink-0 rounded border"
                          aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                        />
                        <span>
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
                        </span>
                      </label>
                    )}
                  />
                  {errors.acceptTerms?.message ? (
                    <p
                      className="text-error-500 mt-2 flex items-center gap-1 text-xs md:text-sm"
                      role="alert"
                    >
                      <ErrorIcon className="h-4 w-4 shrink-0" aria-hidden />
                      {String(errors.acceptTerms.message)}
                    </p>
                  ) : null}
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
