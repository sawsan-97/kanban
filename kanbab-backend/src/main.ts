import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // تكوين CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // روابط الفرونت إند
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  // تكوين Swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for task management application')
    .setVersion('1.0')
    .addTag('Boards', 'Board management')
    .addTag('Columns', 'Column management')
    .addTag('Tasks', 'Task management')
    .addTag('Subtasks', 'Subtask management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Task Management - API Documentation',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('🚀 Server is running on: http://localhost:' + port);
  console.log('📚 API Documentation: http://localhost:' + port + '/api/docs');
  console.log('🗄️ Database: MySQL');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
