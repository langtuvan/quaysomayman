import { DataController } from './data.controller';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schemas
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { SubCategory, SubCategorySchema } from 'src/schemas/subCategory.schema';
import { Page, PageSchema } from 'src/schemas/page.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
// module
import { UserModule } from '../user/user.module';
import { CaslModule } from 'src/auth/cals/casl.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { PageModule } from '../page/page.module';
import { UploadModule } from 'src/Upload/upload.module';

import { CategoryService } from '../category/category.service';
import { SubCategoryService } from '../subCategory/subCategory.service';
import { PageService } from '../page/page.service';

// service, resolver, controller

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Page.name, schema: PageSchema },
    ]),
    CaslModule,
    UploadModule,
    forwardRef(() => UserModule),
    forwardRef(() => SubCategoryModule),
    forwardRef(() => PageModule),
  ],
  controllers: [DataController],
  providers: [CategoryService, SubCategoryService, PageService],
  exports: [],
})
export class DataModule {}
