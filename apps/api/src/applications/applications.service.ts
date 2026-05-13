import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

/** Request body for POST /applications (camelCase JSON). */
export type CreateApplicationDto = {
  firstName: string;
  lastName: string;
  countryId: number;
  phoneCode: string;
  phone: string;
  email: string;
  experienceId: number;
  consent: boolean;
};

const emailOk = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto) {
    if (!dto.consent) {
      throw new BadRequestException({ error: 'VALIDATION' });
    }

    const first = dto.firstName?.trim();
    const last = dto.lastName?.trim();
    const phoneCode = dto.phoneCode?.trim();
    const phoneLocal = dto.phone?.trim();
    const email = dto.email?.trim().toLowerCase();

    if (
      !first ||
      !last ||
      !Number.isInteger(dto.countryId) ||
      dto.countryId < 1 ||
      !phoneCode ||
      !phoneLocal ||
      !email ||
      !emailOk(email) ||
      !Number.isInteger(dto.experienceId) ||
      dto.experienceId < 1
    ) {
      throw new BadRequestException({ error: 'VALIDATION' });
    }

    const codeRow = await this.prisma.client.code.findFirst({
      where: {
        code: phoneCode,
        countries: { some: { countryId: dto.countryId } },
      },
      select: { id: true },
    });

    if (!codeRow) {
      throw new BadRequestException({ error: 'INVALID_CODE' });
    }

    try {
      const row = await this.prisma.client.application.create({
        data: {
          firstname: first,
          lastname: last,
          countryId: dto.countryId,
          codeId: codeRow.id,
          experienceId: dto.experienceId,
          phone: `${phoneCode} ${phoneLocal}`,
          email,
          consent: true,
        },
      });
      return {
        id: row.id,
        firstName: row.firstname,
        lastName: row.lastname,
        countryId: row.countryId,
        codeId: row.codeId,
        experienceId: row.experienceId,
        phone: row.phone,
        email: row.email,
        consent: row.consent,
      };
    } catch {
      throw new InternalServerErrorException({ error: 'DB_ERROR' });
    }
  }
}
