import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// guard pipe
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
import { CurrentUser } from 'src/auth/current-user.decorator';
// service, model, dto

import _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';

import { SubCategoryService } from './subCategory.service';
import { SubCategoryModel } from './subCategory.model';
import { PageService } from '../page/page.service';
import { CategoryService } from '../category/category.service';

@Resolver(() => SubCategoryModel)
export class SubCategoryResolver {
  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private pageService: PageService,
    //private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  @Query((returns) => [SubCategoryModel])
  async subCategories() {
    return this.subCategoryService.find();
  }

  @Query((returns) => SubCategoryModel)
  async subCategory(@Args('id', ObjectIdPipe) id: string) {
    return this.subCategoryService.findById(id);
  }

  @Query((returns) => SubCategoryModel)
  async subCategoryWithSlug(
    @Args('catSlug') catSlug: string,
    @Args('subCatSlug') subCatSlug: string,
  ) {
    const findCategory = await this.categoryService.findOne({
      slug: '/' + catSlug,
    });

    const findSubCats = await this.subCategoryService.find({
      //category: findCategory._id,
      // isProtect: false,
      slug: '/' + subCatSlug,
    });

    const findSubCat = findSubCats.find(
      (f) => f.category.slug === '/' + catSlug,
    );

    if (!findSubCat) {
      throw new NotFoundException('Danh mục không tồn tại!');
    }

    return findSubCat;
  }

  @ResolveField(() => String)
  slug(@Parent() subCategory: SubCategoryModel): string {
    return subCategory.category.slug + subCategory.slug;
  }

  @ResolveField(() => [SubCategoryModel]) // Resolve the SubCategories field for a Category
  async pages(@Parent() subCategory: SubCategoryModel) {
    const pages = await this.pageService.findBySubCatId(
      subCategory._id.toString(),
    );
    return pages.map((page) => ({
      ...page,
      slug: subCategory.slug + page.slug + '-' + page._id,
    }));
  }

  //   @ResolveField(() => [SubCategoryModel]) // Resolve the SubCategories field for a Category
  //   async subCategories(@Parent() category: CategoryModel) {
  //     return this.subCategoryService.findByCatId(category.id);
  //   }

  //   @ResolveField(() => [Product]) // Resolve the Products field for a Category
  //   async products(@Parent() category: Category) {
  //     return this.productService.findByCatId(category.id);
  //   }
}
