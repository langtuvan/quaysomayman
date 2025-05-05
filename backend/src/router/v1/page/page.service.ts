// post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageDto, UpdatePageDto } from './dto/page.dto';
import { Page } from 'src/schemas/page.schema';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name) private readonly PageModel: Model<Page>,
  ) {}

  async find(): Promise<Page[]> {
    return this.PageModel.find().populate(['category', 'subCategory']).exec();
  }

  async findById(id: string): Promise<Page> {
    const data = await this.PageModel.findById(id)
      .populate(['category', 'subCategory'])
      .exec();
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }

  async countBySubCat(subCatId: string): Promise<number> {
    return this.PageModel.countDocuments({ subCategory: subCatId }).exec();
  }

  async findByCatId(id: string): Promise<Page[]> {
    return this.PageModel.find({ category: id }).exec();
  }

  async findBySubCatId(id: string): Promise<Page[]> {
    return this.PageModel.find({
      subCategory: id,
    })
      .populate(['category', 'subCategory', 'createdBy'])
      .lean()
      .exec();
  }

  // Add related products

  // async countByCatId(catId: string): Promise<number> {
  //   return this.productModel.countDocuments({ category: catId }).exec();
  // }

  // async countBySubCatId(subCatId: string): Promise<number> {
  //   return this.productModel.countDocuments({ subCategory: subCatId }).exec();
  // }

  //mutation
  async create(input: PageDto): Promise<Page> {
    const data = new this.PageModel({
      ...input,
    });
    return (await data.save()).populate(['category', 'subCategory']);
  }

  async update(id: string, patchData: UpdatePageDto): Promise<Page> {
    const data = await this.PageModel.findByIdAndUpdate(id, {
      ...patchData,
    })
      .setOptions({ new: true })
      .populate('category', 'id displayName slug')
      .populate('subCategory', 'id displayName slug')
      .exec(); // overwrite: true replay all,
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async delete(id: string): Promise<Page> {
    const data = await this.PageModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
