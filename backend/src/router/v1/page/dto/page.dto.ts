import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { PageDocumentDto } from 'src/dto/PageDocument.dto';

export class PageDto extends PageDocumentDto {
  @IsString()
  category: string;

  @IsString()
  subCategory: string;

  // @IsOptional()
  // @IsBoolean()
  // isPublished: boolean;
}

export class UpdatePageDto extends PartialType(PageDocumentDto) {
  // @IsOptional()
  // @IsBoolean()
  // isPublished: boolean;
}
