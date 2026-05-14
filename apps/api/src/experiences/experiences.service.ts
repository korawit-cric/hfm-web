import { BadRequestException, Injectable } from '@nestjs/common';
import { Locale, Prisma } from '@repo/prisma';

import { PrismaService } from '../prisma/prisma.service';

const experienceInclude = { translations: true } as const;

type ExperienceWithTranslations = Prisma.ExperienceGetPayload<{
  include: typeof experienceInclude;
}>;

export type LocalizedExperience = {
  id: number;
  name: string;
};

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  private pickTranslation(
    experience: ExperienceWithTranslations,
    locale: Locale,
  ): LocalizedExperience {
    const row =
      experience.translations.find((tr) => tr.locale === locale) ??
      experience.translations.find((tr) => tr.locale === Locale.en) ??
      experience.translations[0];
    if (!row) {
      throw new BadRequestException(
        `Experience ${experience.id} has no translations`,
      );
    }
    return {
      id: experience.id,
      name: row.name,
    };
  }

  async findAll(locale: Locale): Promise<LocalizedExperience[]> {
    const rows = await this.prisma.client.experience.findMany({
      orderBy: { id: 'asc' },
      include: experienceInclude,
    });
    return rows.map((r) => this.pickTranslation(r, locale));
  }
}
