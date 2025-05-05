import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseFilters, UseGuards, UsePipes, Request } from '@nestjs/common';
// guard pipe
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
// service, model, dto
import { UserType } from './user.model';
import { UserService } from './user.service';


@Resolver((of) => UserType)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Query((returns) => [UserType])
  async users() {
    return this.userService.findAll();
  }

  @Query((returns) => UserType)
  @UsePipes(ObjectIdPipe)
  async user(@Args('id', { type: () => String }) id: string) {
    return this.userService.findById(id);
  }


}
