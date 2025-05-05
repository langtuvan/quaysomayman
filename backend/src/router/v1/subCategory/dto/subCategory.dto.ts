import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsString } from 'class-validator';
import { PageDocumentDto } from 'src/dto/PageDocument.dto';

export class SubCategoryDto extends PageDocumentDto {
  @IsString()
  @IsMongoId()
  category: string;
}

export class UpdateSubCategoryDto extends PartialType(PageDocumentDto) {}
