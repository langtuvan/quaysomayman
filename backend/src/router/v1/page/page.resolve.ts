import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// guard pipe
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
import { CurrentUser } from 'src/auth/current-user.decorator';
// service, model, dto
import { PageService } from './page.service';
import { PageModel } from './page.model';

// others ref

@Resolver(() => PageModel)
export class PageResolver {
  constructor(private pageService: PageService) {}

  @Query((returns) => [PageModel])
  async pages() {
    return this.pageService.find();
  }

  @Query((returns) => PageModel)
  @UsePipes(ObjectIdPipe)
  async page(@Args('id') id: string) {
    return this.pageService.findById(id);
  }

  @ResolveField(() => String)
  slug(@Parent() page: PageModel): string {
    return (
      page.category.slug + page.subCategory.slug + page.slug + '-' + page._id
    );
    
  }
}
