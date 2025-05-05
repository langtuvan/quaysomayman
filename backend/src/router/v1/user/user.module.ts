import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schemas
import { User, UserSchema } from 'src/schemas/user.schema';
import { Fortune, FortuneSchema } from 'src/schemas/fortuneSchema';

// service, resolver, module
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { FortuneModule } from '../fortune/fortune.module';

import { CaslModule } from 'src/auth/cals/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Fortune.name, schema: FortuneSchema },
    ]),
    forwardRef(() => FortuneModule),
    CaslModule,
  ],
  providers: [UserService, UserResolver],
  //controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
