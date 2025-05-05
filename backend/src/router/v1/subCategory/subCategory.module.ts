import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schemas
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { SubCategory, SubCategorySchema } from 'src/schemas/subCategory.schema';
import { Page, PageSchema } from 'src/schemas/page.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
// module
import { CaslModule } from 'src/auth/cals/casl.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { PageModule } from '../page/page.module';
import { UploadModule } from 'src/Upload/upload.module';
// service, resolver, controller
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryService } from './subCategory.service';
import { ConfigService } from '@nestjs/config';
import { SubCategoryResolver } from './subCategory.resolve';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Page.name, schema: PageSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => PageModule),
    CaslModule,
    UploadModule,
  ],
  providers: [SubCategoryService, ConfigService, SubCategoryResolver],
  controllers: [SubCategoryController],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
