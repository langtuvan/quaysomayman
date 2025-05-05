import {
  PureAbility as Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  buildMongoQueryMatcher,
  createMongoAbility,
  subject,
  //MatchConditions,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { $nor, nor, $ne, $eq, ne, eq } from '@ucast/mongo2js';

import { UserType as User } from 'src/router/v1/user/user.model';

const conditionsMatcher = buildMongoQueryMatcher(
  { $ne, $nor, $eq },
  { ne, nor, eq },
);

export enum Action {
  Manage = 'manage', // full access
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects =
  | InferSubjects<
      typeof User
      // | typeof Post
      // | typeof Category
      // | typeof SubCategory
      // | typeof Product
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    // const { can, cannot, build } = new AbilityBuilder<
    //   Ability<[Action, Subjects]>
    // >(Ability as AbilityClass<AppAbility>);

    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(createMongoAbility as any);

    //const userId = user?.id.toString(); //|| user?._id.toString();

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      // Read
      cannot(Action.Delete, User);
      // cannot(Action.Delete, Category);
      // cannot(Action.Delete, SubCategory);
      // cannot(Action.Delete, Product);
      can(Action.Read, 'all'); //can([Action.Read], [Category, Post, User]); // can(Action.Read, 'all'); // read-only access to everything
    }

    // Post
    // can(Action.Create, Post);
    // can(Action.Update, Post);
    //can(Action.Update, Post, { author: userId }); // not compare authorid and userid // try later
    //cannot(Action.Delete, Post);

    // User
    can(Action.Read, User);
    can(Action.Create, User);
    can(Action.Update, User);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });

    // return build({
    //   // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
    //   detectSubjectType: (item) =>
    //     item.constructor as ExtractSubjectType<Subjects>,
    //   conditionsMatcher: conditionsMatcher, // Using the MongoDB conditions matcher
    // });
  }
}
