import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, TcpOptions, RmqOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

const log = new Logger('centers-svc');

const MS_TRANSPORT = process.env.MS_TRANSPORT ?? 'TCP';
const useTcp = MS_TRANSPORT === 'TCP';

const HTTP_PORT = Number(process.env.SERVICE_PORT) || 3101;
const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
const TCP_PORT = Number(process.env.TCP_PORT) || 4010;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (useTcp) {
    app.connectMicroservice<TcpOptions>({
      transport: Transport.TCP,
      options: { host: TCP_HOST, port: TCP_PORT },
    });
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
  }

  await app.startAllMicroservices();

  // ✅ Prisma: conexión y cierre limpio al apagar el proceso
  const prisma = app.get(PrismaService);
  await prisma.$connect(); // opcional (onModuleInit ya conecta)
  await prisma.enableShutdownHooks(app); // importante para SIGTERM/SIGINT

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

  log.log(`HTTP → http://localhost:${HTTP_PORT}`);
  log.log(`Swagger → http://localhost:${HTTP_PORT}/docs`);
  if (process.env.DATABASE_URL) {
    log.log(
      `DB → ${process.env.DATABASE_URL.replace(/:\/\/.*@/, '://****@')}`, // oculta pass
    );
  }
}
bootstrap();
