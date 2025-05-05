import {
  IsString,
  IsEmail,
  MinLength,
  IsMongoId,
  IsArray,
  IsBoolean,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class PageDocumentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  displayName: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  @MinLength(3)
  content: string;

  @IsString()
  @IsOptional()
  imageSrc: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsBoolean()
  @IsOptional()
  isMenu: boolean;
}
