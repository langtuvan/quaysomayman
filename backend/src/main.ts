import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
//import { CorsOptions } from 'apollo-server-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import { GraphQLError } from 'graphql';
// import { ApolloServerErrorCode } from '@apollo/server/errors';

const corsOptions: CorsOptions = {
  origin: true, //allowedOrigins, // true to active cors
  preflightContinue: false,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //cors
  app.enableCors({
    ...corsOptions,
  });

  //validate Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          field: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  // app.use(graphqlUploadExpress());

  await app.listen(process.env.APP_PORT || 5000);
}
bootstrap();