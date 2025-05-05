import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/Mailer/mail.service';
import { TicketService } from 'src/router/v1/ticket/ticket.service';
import { UserService } from 'src/router/v1/user/user.service';
import { User } from 'src/schemas/user.schema';
import * as _ from 'lodash';
import { Ticket } from 'src/schemas/ticket.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private ticketService: TicketService,
    private jwtService: JwtService,
  ) {}

  async createAccessToken(user: User) {
    const { _id, email, providerId } = user;
    const payload = {
      _id,
      providerId: providerId ? providerId : email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateOTP(): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  //local
  async validateUser(
    username: string, // username
    password: string,
  ): Promise<Partial<User>> {
    // const isEmail = username.includes('@');
    // let user;

    // if (isEmail) {
    //   user = await this.userService.findByEmail(username);
    // } else {
    //   user = await this.userService.findByPhone(username);
    // }

    const user = await this.userService.findByEmail(username);


    if (
      user &&
      (await this.userService.comparePassword(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async VerifyOtp(ticketId: string, ticketOtp: string): Promise<Ticket> {
    if (_.isEmpty(ticketId) || _.isEmpty(ticketOtp)) {
      throw new BadRequestException('Invalid OTP isEmpty');
    }

    const ticket = await this.ticketService.findOne(ticketId);

    if (!ticket) {
      throw new BadRequestException('ticket is used or not found');
    }

    const isMatchOpt = ticket.value === ticketOtp;

    if (!isMatchOpt) {
      throw new BadRequestException('OTP is not match');
    }

    return ticket;
  }
}
