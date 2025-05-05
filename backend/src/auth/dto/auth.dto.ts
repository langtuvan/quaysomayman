//import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  ValidateIf,
  Matches,
  IsMongoId,
} from 'class-validator';

export class SignInLocalDto {
  @IsBoolean()
  isSignInWithEmail: boolean;

  @ValidateIf((o) => o.isSignInWithEmail)
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsEmail()
  email: string;

  @ValidateIf((o) => !o.isSignInWithEmail)
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @Matches(/^[0-9]*$/, { message: 'phone must contain only numbers' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/, {
  //   message: 'newPassword must contain at least one letter and one number',
  // })
  password: string;
}

export class SignUpLocalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ValidateIf((o) => o.isSignUpWithEmail)
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsEmail()
  email: string;

  // @ValidateIf((o) => !o.isSignUpWithEmail)
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(15)
  @Matches(/^[0-9]*$/, { message: 'phone must contain only numbers' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  password: string;

  @IsBoolean()
  isSignUpWithEmail: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  //@ValidateIf((o) => o.newPassword === o.confirmPassword)
  newPassword: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(5)
  // @MaxLength(20)
  // confirmPassword: string;
}

export class ForgotChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  //@MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  //@IsMongoId()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  ticketOtp: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  account: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsMongoId()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  ticketOtp: string;
}
