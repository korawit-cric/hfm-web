import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Locale, Prisma } from '@repo/prisma';

import { PrismaService } from '../prisma/prisma.service';

const include = { translations: true } as const;

type Row = Prisma.PrizeGetPayload<{ include: typeof include }>;

export type LocalizedPrize = {
  id: number;
  amount: string;
  rank: number;
  description: string | null;
};

@Injectable()
export class PrizesService {
  constructor(private readonly prisma: PrismaService) {}

  private pick(row: Row, locale: Locale): LocalizedPrize {
    const tr =
      row.translations.find((t) => t.locale === locale) ??
      row.translations.find((t) => t.locale === Locale.en) ??
      row.translations[0];
    if (!tr) {
      throw new BadRequestException(`Prize ${row.id} has no translations`);
    }
    return {
      id: row.id,
      amount: row.amount.toString(),
      rank: row.rank,
      description: tr.description ?? null,
    };
  }

  async findAll(locale: Locale): Promise<LocalizedPrize[]> {
    const rows = await this.prisma.client.prize.findMany({
      orderBy: { rank: 'asc' },
      include,
    });
    return rows.map((r) => this.pick(r, locale));
  }

  async findOne(id: number, locale: Locale): Promise<LocalizedPrize> {
    const row = await this.prisma.client.prize.findUnique({
      where: { id },
      include,
    });
    if (!row) {
      throw new NotFoundException(`Prize with ID ${id} not found`);
    }
    return this.pick(row, locale);
  }
}
