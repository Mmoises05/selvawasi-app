import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  try {
    console.log('Current Directory:', process.cwd());
    console.log('Directory contents:', fs.readdirSync('.'));
    try {
      console.log('Dist contents:', fs.readdirSync('./dist'));
    } catch (e) { console.log('No dist folder found!'); }

    console.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*', // Allow all origins for simplicity in this MVP
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: false,
    });
    const port = process.env.PORT || 3000;
    console.log(`env.PORT is: ${process.env.PORT}`);
    console.log(`Listening on port: ${port}`);

    // Force binding to 0.0.0.0 for container accessibility
    await app.listen(port, '0.0.0.0');

    console.log(`Application is running on: ${await app.getUrl()}`);

    // Heartbeat to confirm process vitality in logs
    setInterval(() => {
      console.log(`[${new Date().toISOString()}] Server is alive and listening...`);
    }, 10000);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}

// Global error handlers to capture crash reasons
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap();
