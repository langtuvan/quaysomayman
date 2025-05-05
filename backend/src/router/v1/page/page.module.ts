import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schemas
import { User, UserSchema } from 'src/schemas/user.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { SubCategory, SubCategorySchema } from 'src/schemas/subCategory.schema';
import { Page, PageSchema } from 'src/schemas/page.schema';
// module
import { UserModule } from '../user/user.module';
import { CaslModule } from 'src/auth/cals/casl.module';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { UploadModule } from 'src/Upload/upload.module';
// import { FaqModule } from '../faq/faq.module';

// service, resolver, controller
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { ConfigService } from '@nestjs/config';
import { PageResolver } from './page.resolve';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      //
      { name: Page.name, schema: PageSchema },
    ]),
    forwardRef(() => CategoryModule),
    forwardRef(() => SubCategoryModule),
    forwardRef(() => UserModule),
    // forwardRef(() => SaleProductModule),
    // forwardRef(() => ReviewModule),
    // forwardRef(() => FaqModule),
    CaslModule,
    UploadModule,
  ],
  providers: [PageService, ConfigService, PageResolver],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
