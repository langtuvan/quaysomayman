// post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { SubCategory } from 'src/schemas/subCategory.schema';
import { SubCategoryDto, UpdateSubCategoryDto } from './dto/subCategory.dto';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
  ) {}

  async find(filter?: RootFilterQuery<SubCategory>): Promise<SubCategory[]> {
    return this.subCategoryModel.find(filter).populate(['category']).lean();
  }

  async findOne(filter?: RootFilterQuery<SubCategory>): Promise<SubCategory> {
    return this.subCategoryModel
      .findOne({ ...filter })
      .populate(['category'])
      .lean()
      .exec();
  }

  async findById(id: string): Promise<SubCategory> {
    const data = await this.subCategoryModel
      .findById(id)
      .populate(['category'])
      .lean();

    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async findByCatId(catId: string): Promise<SubCategory[]> {
    return this.subCategoryModel
      .find({ category: catId })
      .populate(['createdBy', 'updatedBy', 'category'])
      .exec();
  }

  async countByCatId(catId: string): Promise<number> {
    return this.subCategoryModel.countDocuments({ category: catId }).exec();
  }

  //mutation
  async create(input: SubCategoryDto): Promise<SubCategory> {
    const { ...postData } = input;
    const data = new this.subCategoryModel({
      ...postData,
    });

    const savedSubCategory = await data.save();

    // Then update the parent category
    await this.categoryModel.findByIdAndUpdate(
      input.category,
      { $push: { subCategories: savedSubCategory._id.toString() } },
      //{ new: true },
    );

    return savedSubCategory;
  }

  async update(
    id: string,
    patchData: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const data = await this.subCategoryModel
      .findByIdAndUpdate(id, { ...patchData })
      .setOptions({ new: true })
      .populate('createdBy', 'id name email')
      .populate('updatedBy', 'id name email')
      .populate('category', 'id displayName slug')
      .exec(); // overwrite: true replay all,

    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async delete(id: string): Promise<SubCategory> {
    const data = await this.subCategoryModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
