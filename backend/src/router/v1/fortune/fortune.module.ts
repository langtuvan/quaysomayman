import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schemas
import { Fortune, FortuneSchema } from 'src/schemas/fortuneSchema';
import { User, UserSchema } from 'src/schemas/user.schema';
// service, resolver, module
import { FortuneService } from './fortune.service';
import { FortuneResolver } from './fortune.resolver';
import { UserModule } from '../user/user.module';
import { CaslModule } from 'src/auth/cals/casl.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fortune.name, schema: FortuneSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UserModule),
    CaslModule,
  ],
  providers: [FortuneService, FortuneResolver, ConfigService],
  //controllers: [PostController],
  exports: [FortuneService],
})
export class FortuneModule {}
