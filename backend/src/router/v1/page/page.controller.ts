import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';
import { PageService } from './page.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageDto, UpdatePageDto } from './dto/page.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
import { diskStorage } from 'multer';
import { paramCase } from 'src/utils/change-case';
import path, { extname } from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

const imagePath = '/upload/images/pages';
const folderPath = `./client${imagePath}`;
// Multer configuration
const multerOptions = () => {
  return {
    storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
        //const id = req.params.id;
        const uploadPath = `${folderPath}`;
        //Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req: any, file: any, cb: any) => {
        const filename: string = paramCase(path.parse(file.originalname).name);
        const extension = extname(file.originalname); // Get the file extension
        cb(null, `${filename}${extension}`);
      },
    }),
  };
};

@Controller()
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  // upload image
  @Post(`/uploadImage/:id`)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  async handleUploadCategoryImage(
    @Param('id', ObjectIdPipe) id: string,
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
    const find = await this.pageService.findById(id);

    if (find.imageSrc) {
      const file = `./client${find.imageSrc}`;
      // delete image in folder
      if (fs.existsSync(file)) {
        fs.promises.unlink(file);
      }
    }

    const imageSrc = `${imagePath}/${file.filename}`;

    await this.pageService.update(id, { imageSrc });
    return imageSrc;
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async pages() {
    return this.pageService.find();
  }

  @Get('/:id')
  page(@Param('id') id) {
    return this.pageService.findById(id);
  }

  // optional
  @Patch('/isMenu/:id')
  @UseGuards(JwtAuthGuard)
  async isMenu(@Param('id', ObjectIdPipe) id: string, @Body() body: any) {
    const updateData = { isMenu: body.isMenu };
    return this.pageService.update(id, updateData);
  }

  // mutation
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: PageDto, @CurrentUser() author) {
    const newData = { ...body, createdBy: author._id.toString() };
    return this.pageService.create(newData);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() body: UpdatePageDto,
    @CurrentUser() author,
  ) {
    const category = await this.pageService.findById(id);

    if (!category) {
      throw new NotFoundException('document not found');
    }
    const updateData = { ...body, updatedBy: author._id.toString() };
    return this.pageService.update(id, updateData);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ObjectIdPipe) id: string) {
    const find = await this.pageService.findById(id);
    if (!find) {
      throw new NotFoundException('not found');
    }

    return this.pageService.delete(id);
  }
}
