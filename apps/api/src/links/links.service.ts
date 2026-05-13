import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Locale, Prisma } from '@repo/prisma';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateLinkDto } from './dto/create-link.dto';
import type { UpdateLinkDto } from './dto/update-link.dto';

const linkInclude = { translations: true } as const;

type LinkWithTranslations = Prisma.LinkGetPayload<{
  include: typeof linkInclude;
}>;

export type LocalizedLink = {
  id: number;
  url: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  private pickTranslation(
    link: LinkWithTranslations,
    locale: Locale,
  ): LocalizedLink {
    const row =
      link.translations.find((t) => t.locale === locale) ??
      link.translations.find((t) => t.locale === Locale.en) ??
      link.translations[0];
    if (!row) {
      throw new BadRequestException(`Link ${link.id} has no translations`);
    }
    return {
      id: link.id,
      url: link.url,
      title: row.title,
      description: row.description ?? null,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  async create(data: CreateLinkDto): Promise<LocalizedLink> {
    if (!data.translations?.length) {
      throw new BadRequestException('At least one translation is required');
    }
    const link = await this.prisma.client.link.create({
      data: {
        url: data.url,
        translations: {
          create: data.translations.map((t) => ({
            locale: t.locale,
            title: t.title,
            description: t.description,
          })),
        },
      },
      include: linkInclude,
    });
    return this.pickTranslation(link, data.translations[0].locale);
  }

  async findAll(locale: Locale): Promise<LocalizedLink[]> {
    const rows = await this.prisma.client.link.findMany({
      orderBy: { createdAt: 'desc' },
      include: linkInclude,
    });
    return rows.map((r) => this.pickTranslation(r, locale));
  }

  async findOne(id: number, locale: Locale): Promise<LocalizedLink> {
    const link = await this.prisma.client.link.findUnique({
      where: { id },
      include: linkInclude,
    });
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    return this.pickTranslation(link, locale);
  }

  async update(
    id: number,
    data: UpdateLinkDto,
    locale: Locale,
  ): Promise<LocalizedLink> {
    await this.findOne(id, locale);
    if (data.url !== undefined) {
      await this.prisma.client.link.update({
        where: { id },
        data: { url: data.url },
      });
    }
    if (data.translations?.length) {
      for (const t of data.translations) {
        await this.prisma.client.linkTranslation.upsert({
          where: {
            linkId_locale: { linkId: id, locale: t.locale },
          },
          create: {
            linkId: id,
            locale: t.locale,
            title: t.title,
            description: t.description,
          },
          update: {
            title: t.title,
            description: t.description,
          },
        });
      }
    }
    return this.findOne(id, locale);
  }

  async remove(id: number): Promise<void> {
    const link = await this.prisma.client.link.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    await this.prisma.client.link.delete({ where: { id } });
  }
}
