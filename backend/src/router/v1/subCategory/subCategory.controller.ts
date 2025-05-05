import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  NotFoundException,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';
import { SubCategoryService } from './subCategory.service';
import { SubCategoryDto, UpdateSubCategoryDto } from './dto/subCategory.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
import { PageService } from '../page/page.service';
import { CategoryService } from '../category/category.service';

@Controller()
export class SubCategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly pageService: PageService,
    private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async subCategories() {
    return this.subCategoryService.find();
  }

  @Get('/slug/')
  async subCategoriesBySlug() {
    return this.subCategoryService.find();
  }

  @Get('/slug/:category/:subCategory')
  async categoryBySlug(
    @Param('category') category: string,
    @Param('subCategory') subCategory: string,
  ) {
    const findCategory = await this.categoryService.findOne({
      slug: '/' + category,
    });

    const findSubCat = await this.subCategoryService.findOne({
      slug: '/' + subCategory,
      category: findCategory._id.toString(),
    });

    if (!findSubCat) {
      throw new NotFoundException('Danh mục không tồn tại!');
    }

    return findSubCat;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async subCategory(@Param('id', ObjectIdPipe) id: string) {
    const find = await this.subCategoryService.findById(id);
    if (!find) {
      throw new NotFoundException('Document not found');
    }
    return find;
  }

  // optional
  @Patch('/isMenu/:id')
  @UseGuards(JwtAuthGuard)
  async isMenu(@Param('id', ObjectIdPipe) id: string, @Body() body: any) {
    const updateData = { isMenu: body.isMenu };
    return this.subCategoryService.update(id, updateData);
  }

  // mutation
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: SubCategoryDto, @CurrentUser() author) {
    const newData = { ...body, createdBy: author._id.toString() };
    return this.subCategoryService.create(newData);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() body: UpdateSubCategoryDto,
    @CurrentUser() author,
  ) {
    const category = await this.subCategoryService.findById(id);

    if (!category) {
      throw new NotFoundException('document not found');
    }
    const updateData = { ...body, updatedBy: author._id.toString() };
    return this.subCategoryService.update(id, updateData);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ObjectIdPipe) id: string) {
    const find = await this.subCategoryService.findById(id);
    if (find.canDelete === false || find.isProtect) {
      throw new BadRequestException('Không thể xóa danh mục này!');
    }
    const pages = await this.pageService.countBySubCat(id);
    if (pages > 0) {
      throw new BadRequestException('Có đối tượng liên quan, không thể xóa!');
    }

    return this.subCategoryService.delete(id);
  }
}
