import {
  Controller,
  Get,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { Express } from 'express';

// auth
// import { AuthGuard } from 'src/guard/auth.guard';

// service
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { readdirSync } from 'fs-extra';
import { extname } from 'path';
import { paramCase } from 'src/utils/change-case';
import { readFileSync } from 'fs';
//import path from 'path';
const path = require('path');

// Multer configuration
const multerOptions = (destination: string) => {
  return {
    storage: diskStorage({
      destination,

      filename: (req: any, file: any, cb: any) => {
        const filename: string = paramCase(path.parse(file.originalname).name);
        const extension = extname(file.originalname); // Get the file extension
        cb(null, `${filename}${extension}`);
      },
    }),
  };
};

// @UseGuards(AuthGuard)
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(`/images/ecommerce-images/category/`)
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerOptions('./client/upload/images/ecommerce-images/category/'),
    ),
  )
  async handleUploadCategoryImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1200000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return `/upload/images/ecommerce-images/category/${file.filename}`;
  }

  @Post('/images/ecommerce-images/category/collection')
  @UseInterceptors(
    FilesInterceptor(
      'images',
      10,
      multerOptions(
        './client/upload/images/ecommerce-images/category/collection',
      ),
    ),
  )
  async handleUploadCollectionImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1200000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return files.map(
      (file) =>
        `/upload/images/ecommerce-images/category/collection/${file.filename}`,
    );
  }

  // upload subcategory
  @Post(`/images/ecommerce-images/subCategory/`)
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerOptions('./client/upload/images/ecommerce-images/subCategory/'),
    ),
  )
  async handleUploadSubCategoryImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1200000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return `/upload/images/ecommerce-images/subCategory/${file.filename}`;
  }

  // update product
  @Post('/images/ecommerce-images/product/')
  @UseInterceptors(
    FilesInterceptor(
      'images',
      10,
      multerOptions('./client/upload/images/ecommerce-images/product/'),
    ),
  )
  async handleUploadProductImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1200000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return files.map(
      (file) => `/upload/images/ecommerce-images/product/${file.filename}`,
    );
  }

  @Get('/images')
  async getImages() {
    return readFileSync(`./client/upload/images/reviews/`);
  }
}
