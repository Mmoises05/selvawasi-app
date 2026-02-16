import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*', // Allow all origins for simplicity in this MVP
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: false,
    });
    const port = process.env.PORT ?? 4000;
    console.log(`Listening on port: ${port}`);
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
