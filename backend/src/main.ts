import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Body limit custom set karne ka simple tarika
  app.use(express.json({ limit: '2mb' }));

  // Support comma-separated origins: "https://a.com,https://b.com"
  const rawOrigins = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Inspector backend running on port ${port}`);
}

void bootstrap();