import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './exception-filter';
import { ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dasalon')
    .setDescription('Your API Description')
    .setVersion('1.0')
    // .addTag('your-tag') // Optional: Add tags for grouping endpoints
    .build();
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));
  // app.useGlobalPipes(new ZodValidationPipe());

  app.setGlobalPrefix('api/v1');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
