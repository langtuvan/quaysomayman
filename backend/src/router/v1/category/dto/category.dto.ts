import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsString } from 'class-validator';
import { PageDocumentDto } from 'src/dto/PageDocument.dto';
export class CategoryDto extends PageDocumentDto {}
export class UpdateCategoryDto extends PartialType(CategoryDto) {}
