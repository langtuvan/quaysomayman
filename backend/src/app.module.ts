import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { APP_FILTER, APP_GUARD, APP_PIPE, RouterModule } from '@nestjs/core';
// Grapql
import {
  ApolloDriver,
  ApolloDriverConfig,
  ValidationError,
} from '@nestjs/apollo';
// Passport Auth JWT
import { PassportModule } from '@nestjs/passport';
// others
import { join } from 'path';
// modules
import { UserModule } from './router/v1/user/user.module';
import { AuthModule } from './auth/auth.module';
import { FortuneModule } from './router/v1/fortune/fortune.module';
// import { ValidationError } from 'class-validator';
// import { GraphQLFormattedError } from 'graphql';
import { CaslModule } from './auth/cals/casl.module';

// import { graphqlUploadExpress } from 'graphql-upload';
import { UploadModule } from './Upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';

import GraphQLJSON from 'graphql-type-json';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './Mailer/mail.module';
import { TicketModule } from './router/v1/ticket/ticket.module';
import { GraphQLFormattedError } from 'graphql';

import { DataModule } from './router/v1/data/data.module';
import { CategoryModule } from './router/v1/category/category.module';
import { SubCategoryModule } from './router/v1/subCategory/subCategory.module';
import { PageModule } from './router/v1/page/page.module';

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
    MongooseModule.forRoot(process.env.DATABASE_URL),
    // Test Default Module
    PassportModule,
    CaslModule,
    ThrottlerModule,
    //Modules GraphQl
    AuthModule,
    UploadModule,
    DataModule,
    UserModule,
    FortuneModule,
    MailModule,
    TicketModule,

    // page
    CategoryModule,
    SubCategoryModule,
    PageModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      //exclude: ['/public/(.*)'],
    }),
    //Router Controller
    RouterModule.register([
      { path: 'auth', module: AuthModule },
      { path: 'upload', module: UploadModule },
      { path: 'getData', module: DataModule },
      {
        path: 'v1',
        children: [
          { path: 'category', module: CategoryModule },
          { path: 'subCategory', module: SubCategoryModule },
          { path: 'page', module: PageModule },
        ],
      },
    ]),
    MulterModule.register({
      dest: './upload',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
