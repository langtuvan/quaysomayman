import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { SubCategoryService } from '../subCategory/subCategory.service';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';

@Controller()
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async categories() {
    return this.categoryService.find();
  }

  @Get('/slug/')
  async categoriesBySlug() {
    return this.categoryService.find();
  }

  @Get('/slug/:slug')
  async categoryBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.findOne({
      slug: slug === 'homePage' ? '/' : '/' + slug,
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại!');
    }

    return category;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async category(@Param('id', ObjectIdPipe) id: string) {
    return this.categoryService.findById(id);
  }

  // optional
  @Patch('/isMenu/:id')
  @UseGuards(JwtAuthGuard)
  async isMenu(@Param('id', ObjectIdPipe) id: string, @Body() body: any) {
    const updateData = { isMenu: body.isMenu };
    return this.categoryService.update(id, updateData);
  }

  // mutation
  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() body: CategoryDto, @CurrentUser() author) {
    const newData = { ...body, createdBy: author._id.toString() };
    return this.categoryService.create(newData);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Param('id', ObjectIdPipe) id: string,
    @Body() body: UpdateCategoryDto,
    @CurrentUser() author,
  ) {
    const category = await this.categoryService.findById(id);

    const { slug, ...rest } = body;

    const updateData = category.isProtect
      ? { ...rest, updatedBy: author._id.toString() }
      : { ...body, updatedBy: author._id.toString() };
    return this.categoryService.update(id, updateData);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id', ObjectIdPipe) id: string) {
    const category = await this.categoryService.findById(id);

    if (category.canDelete === false || category.isProtect) {
      throw new BadRequestException('Không thể xóa danh mục này!');
    }

    const subCategories = await this.subCategoryService.countByCatId(id);
    if (subCategories > 0) {
      throw new BadRequestException('Có đối tượng liên quan, không thể xóa!');
    }

    return this.categoryService.delete(id);
  }
}
