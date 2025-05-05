import { IsString, IsEmail, MinLength } from 'class-validator';

export class TicketInput {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  type: string;

  @IsString()
  value: string;
}

export class TicketUpdateInput extends TicketInput {}
