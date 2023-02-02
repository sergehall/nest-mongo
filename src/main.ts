import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { TrimPipe } from './pipes/trim-pipe';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.set('trust proxy', true);
  const configService = app.get(ConfigService<ConfigType>);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      transform: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const customErrors = errors.map((e) => {
          const firstError = JSON.stringify(e.constraints);
          return { field: e.property, message: firstError };
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
  await app.listen(configService.get('PORT') || 5000, () => {
    console.log(`Example app listening on port: ${process.env.PORT || 5000}`);
  });
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
