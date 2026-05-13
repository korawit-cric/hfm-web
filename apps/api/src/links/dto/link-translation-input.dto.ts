import { ApiProperty } from '@nestjs/swagger';
import { Locale } from '@repo/prisma';

export class LinkTranslationInputDto {
  @ApiProperty({ enum: Locale })
  locale: Locale;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;
}
