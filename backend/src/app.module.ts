import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { RouterModule } from '@nestjs/core';
// Grapql
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// Passport Auth JWT
import { PassportModule } from '@nestjs/passport';
// others
import { join } from 'path';
// modules
import { UserModule } from './router/v1/user/user.module';
import { AuthModule } from './auth/auth.module';
import { FortuneModule } from './router/v1/fortune/fortune.module';
import { CaslModule } from './auth/cals/casl.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      subscriptions: {
        'graphql-ws': true,
      },
      //installSubscriptionHandlers: true,
      formatError: (formattedError: GraphQLFormattedError | any) => {
        const {
          path,
          extensions: { message, code, originalError },
        } = formattedError;

        return { message, extensions: { code, originalError }, path };
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    //Connect DB
    MongooseModule.forRoot(
      'mongodb+srv://langtuvan:rhRZ5VeS4YYTyA1h@cluster0.omftx.mongodb.net/quaysomayman',
    ),
    // Test Default Module
    PassportModule,
    CaslModule,
    ThrottlerModule,
    //Modules GraphQl
    AuthModule,
    UserModule,
    FortuneModule,
    //Router Controller
    RouterModule.register([{ path: 'auth', module: AuthModule }]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [],
})
export class AppModule {}
