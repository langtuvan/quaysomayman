import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  ValidateNested,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class PrizeInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string;

  @Field()
  @IsNumber()
  key: number;

  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field()
  @IsNumber()
  qty: number;
}

@InputType()
class PersonInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  manv: string;

  @Field()
  @IsString()
  @MinLength(2)
  name: string;
}

@InputType()
export class WinnerInput extends PersonInput {
  @Field()
  @IsString()
  prizeId: string;

  @Field()
  @IsString()
  prize: string;
}

@InputType()
export class FortuneDto {
  @Field()
  @IsString()
  @MinLength(3)
  type: 'random' | 'wheel';

  @Field()
  @IsString()
  @MinLength(5)
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [PersonInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PersonInput)
  persons?: PersonInput[];

  @Field(() => [PrizeInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrizeInput)
  prizes?: PrizeInput[];
}

@InputType()
export class UpdateFortuneDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(4)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [PersonInput], { nullable: true })
  @IsOptional()
  // chua validate dc
  // @ValidateNested({ each: true })
  // @Type(() => PersonInput)
  persons?: PersonInput[];

  @Field(() => [PrizeInput], { nullable: true })
  @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => PrizeInput)
  prizes?: PrizeInput[];
}

@InputType()
export class SpinWheelInput {
  @Field()
  @IsString()
  player: string;
}

@InputType()
export class RandomInput {
  @Field()
  @IsString()
  prizeId: string;
}
