// post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fortune } from 'src/schemas/fortuneSchema';
import { FortuneDto, UpdateFortuneDto } from './dto/fortune.dto';

@Injectable()
export class FortuneService {
  constructor(@InjectModel(Fortune.name) private postModel: Model<Fortune>) {}

  async find(createdBy: string, type: string): Promise<Fortune[]> {
    return this.postModel
      .find({ createdBy, type })
      .populate(['createdBy'])
      .exec();
  }

  async findById(id: string): Promise<Fortune> {
    return this.postModel.findById(id).populate(['createdBy']).exec();
  }

  async findByIdAndUpdate(
    id: string,
    update: any,
    options: any = { new: true },
  ): Promise<any> {
    const data = await this.postModel
      .findByIdAndUpdate(id, update, options)
      .populate(['createdBy'])
      .exec();

    if (!data) {
      throw new NotFoundException(`Fortune with ID ${id} not found`);
    }

    return data;
  }

  //mutation
  async create(postData: FortuneDto, createdBy: string): Promise<Fortune> {
    const data = new this.postModel({
      ...postData,
      createdBy,
    });
    return (await data.save()).populate(['createdBy']);
  }

  async update(id: string, patchData: Partial<Fortune>): Promise<Fortune> {
    const data = await this.postModel
      .findByIdAndUpdate(id, patchData)

      .setOptions({ new: true })
      .populate(['createdBy'])
      .exec(); // overwrite: true replay all,
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }

  async delete(id: string): Promise<Fortune> {
    const data = await this.postModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
}
