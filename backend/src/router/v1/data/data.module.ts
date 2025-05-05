import { DataController } from './data.controller';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schemas

import { User, UserSchema } from 'src/schemas/user.schema';
// module
import { UserModule } from '../user/user.module';
import { CaslModule } from 'src/auth/cals/casl.module';


// service, resolver, controller

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    CaslModule,
    forwardRef(() => UserModule),

  ],
  controllers: [DataController],
  providers: [],
  exports: [],
})
export class DataModule {}
