import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Locale, Prisma } from '@repo/prisma';

import { PrismaService } from '../prisma/prisma.service';

const include = { translations: true } as const;

type Row = Prisma.RankingGetPayload<{ include: typeof include }>;

export type LocalizedRanking = {
  id: number;
  sn: string;
  gain: string;
  bonus: string;
  rank: number;
  name: string;
};

@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService) {}

  private pick(row: Row, locale: Locale): LocalizedRanking {
    const tr =
      row.translations.find((t) => t.locale === locale) ??
      row.translations.find((t) => t.locale === Locale.en) ??
      row.translations[0];
    if (!tr) {
      throw new BadRequestException(`Ranking ${row.id} has no translations`);
    }
    return {
      id: row.id,
      sn: row.sn,
      gain: row.gain.toString(),
      bonus: row.bonus.toString(),
      rank: row.rank,
      name: tr.name,
    };
  }

  async findAll(locale: Locale): Promise<LocalizedRanking[]> {
    const rows = await this.prisma.client.ranking.findMany({
      orderBy: { rank: 'asc' },
      include,
    });
    return rows.map((r) => this.pick(r, locale));
  }

  async findOne(id: number, locale: Locale): Promise<LocalizedRanking> {
    const row = await this.prisma.client.ranking.findUnique({
      where: { id },
      include,
    });
    if (!row) {
      throw new NotFoundException(`Ranking with ID ${id} not found`);
    }
    return this.pick(row, locale);
  }
}
