import {
  Controller,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
@Throttle({ default: { limit: 10, ttl: 300000 } })
export class MailController {
  constructor(
    //private readonly userService: UserService,
  ) {}

}
