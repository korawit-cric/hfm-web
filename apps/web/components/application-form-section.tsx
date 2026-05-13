'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { z } from 'zod';
import { ArrowRight } from '@repo/icons';
import { useCustomForm, FormWrapper } from '@repo/ui/form/form-wrapper';
import { FormInput } from '@repo/ui/form/form-input';
import { FormDropdownSelect } from '@repo/ui/form/form-dropdown-select';
import { FormCheckbox } from '@repo/ui/form/form-checkbox';
import { FormButton } from '@repo/ui/form/form-button';

import type {
  Country,
  Experience,
  CreateApplicationBody,
  SavedApplication,
} from '@repo/api-client';

import { useSubmitApplicationMutation } from '@/features/applications';
import { JOIN_NOW_PRIMARY_BUTTON_CLASSNAME } from '@/components/shared-classes/join-now-button-classes';
import { Link } from '@/lib/i18n/navigation';

/** Success toasts stay on screen long enough to read the saved summary. */
const SUBMIT_SUCCESS_TOAST_MS = 12_000;
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

function toCreateBody(data: ApplicationFormValues): CreateApplicationBody {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    countryId: Number(data.countryId),
    phoneCode: data.phoneCode.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    experienceId: Number(data.experienceId),
    consent: data.acceptTerms,
  };
}

function formatSubmitSuccessDescription(
  data: SavedApplication,
  countries: Country[],
  experiences: Experience[],
  label: (key: string) => string,
): string {
  const countryName =
    countries.find((c) => c.id === data.countryId)?.name ??
    `${label('applicationForm.savedToast.unknownCountry')} (${data.countryId})`;

  const experienceName =
    experiences.find((e) => e.id === data.experienceId)?.name ??
    `${label('applicationForm.savedToast.unknownExperience')} (${data.experienceId})`;

  const lines = [
    `${label('applicationForm.savedToast.referenceId')}: ${data.id}`,
    `${label('applicationForm.savedToast.fullName')}: ${data.firstName} ${data.lastName}`,
    `${label('applicationForm.savedToast.country')}: ${countryName}`,
    `${label('applicationForm.savedToast.phone')}: ${data.phone}`,
    `${label('applicationForm.savedToast.email')}: ${data.email}`,
    `${label('applicationForm.savedToast.experience')}: ${experienceName}`,
    `${label('applicationForm.savedToast.termsAccepted')}: ${label('applicationForm.savedToast.yes')}`,
  ];
  return lines.join('\n');
}

type Props = {
  countries: Country[];
  experiences: Experience[];
};

export function ApplicationFormSection({ countries, experiences }: Props) {
  const t = useTranslations('HomePage');
  const submitMutation = useSubmitApplicationMutation();

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

  async function runSubmit(data: ApplicationFormValues) {
    const result = await submitMutation.mutateAsync(toCreateBody(data));
    if (result.ok) {
      toast.success(t('applicationForm.submitSuccess'), {
        description: formatSubmitSuccessDescription(
          result.data,
          countries,
          experiences,
          t,
        ),
        duration: SUBMIT_SUCCESS_TOAST_MS,
      });
      form.reset();
      return;
    }
    if (result.error === 'invalid_code') {
      toast.error(t('applicationForm.submitInvalidCode'));
      return;
    }
    toast.error(t('applicationForm.submitError'));
  }

  const handleSubmit = (data: ApplicationFormValues) => {
    void runSubmit(data);
  };

  return (
    <section
      id="application-form"
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
                    className={JOIN_NOW_PRIMARY_BUTTON_CLASSNAME}
                    autoDisable={false}
                    disabled={submitMutation.isPending}
                  >
                    {t('applicationForm.submit')}
                  </FormButton>
                </div>
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
