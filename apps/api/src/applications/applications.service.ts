import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Application } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

const emailOk = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponse(row: Application): ApplicationResponseDto {
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
  }

  async findAll(): Promise<ApplicationResponseDto[]> {
    const rows = await this.prisma.client.application.findMany({
      orderBy: { id: 'asc' },
    });
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(id: number): Promise<ApplicationResponseDto> {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException({ error: 'VALIDATION' });
    }
    const row = await this.prisma.client.application.findUnique({
      where: { id },
    });
    if (!row) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return this.toResponse(row);
  }

  async create(dto: CreateApplicationDto): Promise<ApplicationResponseDto> {
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
      return this.toResponse(row);
    } catch {
      throw new InternalServerErrorException({ error: 'DB_ERROR' });
    }
  }
}
