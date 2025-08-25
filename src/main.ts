import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, TcpOptions, RmqOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

const ENV = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';
const isProd = (process.env.NODE_ENV ?? '').toLowerCase() === 'production';

if (!isProd) {
  for (const file of [`.env.${ENV}.local`, `.env.${ENV}`, '.env']) {
    const p = path.resolve(process.cwd(), file);
    if (fs.existsSync(p)) {
      dotenv.config({ path: p, override: false });
    }
  }
} else {
}

const log = new Logger('centers-svc');

const MS_TRANSPORT = process.env.MS_TRANSPORT ?? 'TCP';
const useTcp = MS_TRANSPORT === 'TCP';
const HTTP_PORT = Number(process.env.SERVICE_PORT ?? 3102);

const TCP_HOST = process.env.MS_HOST ?? '0.0.0.0';
const TCP_PORT = Number(process.env.MS_TCP_PORT ?? 4030);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (useTcp) {
    app.connectMicroservice<TcpOptions>({
      transport: Transport.TCP,
      options: { host: TCP_HOST, port: TCP_PORT },
    });
    log.log(`MS (TCP) → ${TCP_HOST}:${TCP_PORT}`);
  } else {
    app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: process.env.RMQ_QUEUE || 'centers_queue',
        queueOptions: { durable: true },
        prefetchCount: Number(process.env.RMQ_PREFETCH ?? 10),
      },
    });
    log.log(`MS (RMQ) → queue=${process.env.RMQ_QUEUE || 'centers_queue'}`);
  }

  await app.startAllMicroservices();

  const prisma = app.get(PrismaService) as any;
  if (typeof prisma?.$connect === 'function') {
    await prisma.$connect();
  }
  if (typeof prisma?.enableShutdownHooks === 'function') {
    await prisma.enableShutdownHooks(app);
  }

  const config = new DocumentBuilder()
    .setTitle('centers-svc (internal)')
    .setDescription('Endpoints internos para debug del microservicio')
    .setVersion('1.0.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, doc);

  await app.listen(HTTP_PORT);
  log.log(`HTTP → http://0.0.0.0:${HTTP_PORT}`);
  log.log(`Swagger → http://0.0.0.0:${HTTP_PORT}/docs`);
  if (process.env.DATABASE_URL) {
    log.log(
      `DB → ${String(process.env.DATABASE_URL).replace(/:\/\/.*@/, '://****@')}`,
    );
  }
}
bootstrap();
