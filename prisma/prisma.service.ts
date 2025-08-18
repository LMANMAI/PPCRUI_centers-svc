import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  enableShutdownHooks(app: INestApplication) {
    const cleanUp = async () => {
      try {
        await this.$disconnect();
      } finally {
        await app.close();
      }
    };
    process.on('SIGINT', cleanUp);
    process.on('SIGTERM', cleanUp);
    process.on('SIGQUIT', cleanUp);
  }
}
