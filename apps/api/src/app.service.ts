import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'HFM API',
      description: 'REST API for hfm-web (NestJS, Prisma)',
      version: '1.0.0',
      docs: '/api',
      endpoints: {
        swagger: 'GET /api',
      },
    };
  }
}
