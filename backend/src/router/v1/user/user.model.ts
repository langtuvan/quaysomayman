import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from 'src/config/enum';


@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field({
    nullable: true,
    defaultValue: 'http://localhost:5000/assets/user-icon-photo.png',
  })
  avatarSrc: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  isAdmin: boolean;

  @Field({ nullable: true })
  provider?: string;

  @Field({ nullable: true })
  providerId?: string;

  // author & timestamps
  @Field({ nullable: true, defaultValue: null })
  createdBy: UserType;

  @Field({ nullable: true, defaultValue: null })
  updatedBy: UserType;

  @Field({ nullable: true, defaultValue: null })
  createdAt: Date;

  @Field({ nullable: true, defaultValue: null })
  updatedAt: Date;
}
