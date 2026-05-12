import { Module } from '@nestjs/common';

import { FaqsModule } from './faqs/faqs.module';
import { LinksModule } from './links/links.module';
import { RankingsModule } from './rankings/rankings.module';
import { PrismaModule } from './prisma/prisma.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, LinksModule, RankingsModule, FaqsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
