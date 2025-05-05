import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from '../user/user.model';

@ObjectType()
export class PrizeType {
  @Field(() => ID)
  id: string;

  @Field()
  key: number;

  @Field()
  name: string;

  @Field()
  qty: number;
}

@ObjectType()
export class PersonModel {
  @Field(() => ID)
  id: string;

  @Field()
  manv: string;

  @Field()
  name: string;
}

@ObjectType()
export class WinnerModel extends PersonModel {
  @Field(() => ID)
  id: string;

  @Field()
  prizeId: string;

  @Field()
  key: number;

  @Field()
  prize: string;
}

@ObjectType()
export class FortuneModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => [PersonModel], { nullable: true, defaultValue: [] })
  persons: PersonModel[];

  @Field(() => [PrizeType], { nullable: true, defaultValue: [] })
  prizes: PrizeType[];

  @Field(() => [WinnerModel], { nullable: true, defaultValue: [] })
  winners: WinnerModel[];

  // author & timestamps
  @Field(() => UserType)
  createdBy: UserType;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
