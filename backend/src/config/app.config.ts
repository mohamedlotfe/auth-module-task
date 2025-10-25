import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

export function setupCors(app: INestApplication, configService: ConfigService) {
  app.enableCors({
    origin:
      configService.get<string>('FRONTEND_ORIGIN') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

export function setupSecurity(app: INestApplication) {
  app.use(helmet());
}

export function setupValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}

export function setupFilters(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}
