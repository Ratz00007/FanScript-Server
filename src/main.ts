import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Validation pipe with whitelist and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Security headers with Helmet
  // Note: Helmet is applied via middleware in app.module

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('FanScript API')
    .setDescription('Tickets to Fans, Not Bots - Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('events', 'Event management')
    .addTag('venues', 'Venue management')
    .addTag('artists', 'Artist management')
    .addTag('orders', 'Order management')
    .addTag('tickets', 'Ticket management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get port from environment or use default
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`
🚀 FanScript API is running!
   
   Local:      http://localhost:${port}
   API Docs:   http://localhost:${port}/api/docs
   Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap();
