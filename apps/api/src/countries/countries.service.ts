import { BadRequestException, Injectable } from '@nestjs/common';
import { Locale, Prisma } from '@repo/prisma';

import { PrismaService } from '../prisma/prisma.service';

const countryInclude = {
  translations: true,
  codeLinks: {
    orderBy: { codeId: 'asc' as const },
    include: { code: true },
  },
} as const;

type CountryWithTranslations = Prisma.CountryGetPayload<{
  include: typeof countryInclude;
}>;

export type LocalizedCountry = {
  id: number;
  name: string;
  /** E.164-style dialing prefix from DB (e.g. +66), first linked code when several exist. */
  phoneCode: string;
};

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  private pickTranslation(
    country: CountryWithTranslations,
    locale: Locale,
  ): LocalizedCountry {
    const row =
      country.translations.find((tr) => tr.locale === locale) ??
      country.translations.find((tr) => tr.locale === Locale.en) ??
      country.translations[0];
    if (!row) {
      throw new BadRequestException(
        `Country ${country.id} has no translations`,
      );
    }
    const dial = country.codeLinks[0]?.code.code;
    return {
      id: country.id,
      name: row.name,
      phoneCode: dial ?? '',
    };
  }

  async findAll(locale: Locale): Promise<LocalizedCountry[]> {
    const rows = await this.prisma.client.country.findMany({
      orderBy: { id: 'asc' },
      include: countryInclude,
    });
    return rows.map((r) => this.pickTranslation(r, locale));
  }
}
