import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from 'src/router/v1/user/user.model';

@ObjectType()
export class DocumentModel {
  @Field()
  _id: string;

  @Field()
  displayName: string;

  @Field()
  description: string;

  @Field({ nullable: true, defaultValue: null })
  slug: string;

  @Field({ nullable: true, defaultValue: null })
  imageSrc: string;

  @Field({ nullable: true, defaultValue: null })
  content: string;

  @Field({ nullable: true, defaultValue: false })
  isProtect: boolean;

  // author & timestamps
  @Field(() => UserType)
  createdBy: UserType;

  @Field(() => UserType, { nullable: true, defaultValue: null })
  updatedBy: UserType;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
