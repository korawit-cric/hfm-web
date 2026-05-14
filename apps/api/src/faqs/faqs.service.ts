import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Locale, Prisma } from '@repo/prisma';

import { PrismaService } from '../prisma/prisma.service';

const include = { translations: true } as const;

type Row = Prisma.FqaGetPayload<{ include: typeof include }>;

export type LocalizedFaq = {
  id: number;
  q: string;
  a: string;
};

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  private pick(row: Row, locale: Locale): LocalizedFaq {
    const tr =
      row.translations.find((t) => t.locale === locale) ??
      row.translations.find((t) => t.locale === Locale.en) ??
      row.translations[0];
    if (!tr) {
      throw new BadRequestException(`FAQ ${row.id} has no translations`);
    }
    return {
      id: row.id,
      q: tr.q,
      a: tr.a,
    };
  }

  async findAll(locale: Locale): Promise<LocalizedFaq[]> {
    const rows = await this.prisma.client.fqa.findMany({
      orderBy: { id: 'asc' },
      include,
    });
    return rows.map((r) => this.pick(r, locale));
  }

  async findOne(id: number, locale: Locale): Promise<LocalizedFaq> {
    const row = await this.prisma.client.fqa.findUnique({
      where: { id },
      include,
    });
    if (!row) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return this.pick(row, locale);
  }
}
