// post.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, RootQuerySelector } from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async find(filter?: RootFilterQuery<Category>): Promise<Category[]> {
    return this.categoryModel
      .find({ ...filter })
      .lean()
      .exec();
  }

  async findOne(filter?: RootFilterQuery<Category>): Promise<Category> {
    return this.categoryModel.findOne({ ...filter }).exec();
  }

  async findById(id: string): Promise<Category> {
    const data = await this.categoryModel.findById(id).lean().exec();

    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  //mutation
  async create(postData: CategoryDto): Promise<Category> {
    const category = new this.categoryModel(postData);
    return (await category.save()).populate('createdBy', 'id name email');
  }

  async update(id: string, patchData: UpdateCategoryDto): Promise<Category> {
    const data = await this.categoryModel
      .findByIdAndUpdate(id, { ...patchData })
      .populate('createdBy', 'id name email')
      .setOptions({ new: true })
      .lean()
      .exec(); // overwrite: true replay all,
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async delete(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndDelete(id).lean().exec();
  }
}
