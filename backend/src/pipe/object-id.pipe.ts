// import {
//   PipeTransform,
//   Injectable,
//   ArgumentMetadata,
//   BadRequestException,
// } from '@nestjs/common';
// import { Types } from 'mongoose';

// @Injectable()
// export class ObjectIdPipe implements PipeTransform {
//   transform(value: string, metadata: ArgumentMetadata) {
//     if (!Types.ObjectId.isValid(value)) {
//       throw new BadRequestException(`Giá trị ObjectId không hợp lệ: ${value}`);
//     }
//     return new Types.ObjectId(value);
//   }
// }
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return new Types.ObjectId(value);
  }
}