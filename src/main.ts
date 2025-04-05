import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './common/filters/exception-filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';

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
  // app.use(cors());
  app.use(
    cors({
      origin: ['*', 'http://localhost:3000', 'https://dasalon-chi.vercel.app'],
    }),
  );
  // app.enableCors({
  //   origin: ['*', 'http://localhost:3000'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 4001);
}
bootstrap();
