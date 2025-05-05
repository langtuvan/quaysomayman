import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  Res,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../router/v1/user/user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';

import {
  ChangePasswordDto,
  ForgotChangePasswordDto,
  ForgotPasswordDto,
  SignInLocalDto,
  SignUpLocalDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import * as _ from 'lodash';
import { User } from 'src/schemas/user.schema';
import { TicketService } from 'src/router/v1/ticket/ticket.service';
import { MailService } from 'src/Mailer/mail.service';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly ticketService: TicketService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  @Post('/signOut')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req, @Response() res) {

    // Clear JWT from cookie if using cookies
    res.clearCookie('jwt');

    // Invalidate the token on the client side
    res.setHeader('Authorization', '');

    // Clear user session
    req.user = null;
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  @Throttle({ default: { limit: 2, ttl: 900 } }) // 900 seconds = 15 minutes
  @Post('signin')
  async login(@Request() req, @Body() body: SignInLocalDto) {
    const { email, phone, password: pass } = body;
    const user = await this.authService.validateUser(email, pass);

    if (!user) {
      throw new BadRequestException({
        message: [
          {
            field: 'password',
            message: 'your account or password maybe wrong !',
          },
        ],
      });
    }

    //verify user
    // if (!user.confirmEmail && body.email) {
    //   throw new BadRequestException({
    //     message: [{ field: 'email', message: 'your Email is not verified' }],
    //   });
    // }

    // if (!user.confirmPhone && body.phone) {
    //   throw new BadRequestException({
    //     message: [{ field: 'phone', message: 'your Phone is not verified' }],
    //   });
    // }

    const Token = await this.authService.createAccessToken(user as User);

    const { email: usermail, name, roles, isAdmin, provider } = user;

    return {
      user: {
        email: usermail,
        name,
        roles,
        isAdmin,
        provider,
      },
      accessToken: Token.accessToken,
    };
  }

  @Post('signup')
  async signUp(@Body() body: SignUpLocalDto) {
    const { isSignUpWithEmail, ...data } = body;

    // isSignUpWithEmail
    // Check if email exists
    if (body.email && (await this.userService.findByEmail(body.email))) {
      throw new BadRequestException([
        { field: 'email', message: 'Email already exists' },
      ]);
    }

    // Check if phone exists
    if (body.phone && (await this.userService.findByPhone(body.phone))) {
      throw new BadRequestException([
        { field: 'phone', message: 'Phone already exists' },
      ]);
    }
    // Create user
    const newUser = await this.userService.create(data);
    // Generate OTP
    const otp = await this.authService.generateOTP();

    //new ticket
    const newTicket: any = await this.ticketService.findOneAndReplace(
      // condition
      {
        type: 1, // type = 1 for active account
        key: newUser?.email || newUser?.phone,
      },
      // data
      {
        name: 'Active Account',
        description: `OTP for ${body?.email || body?.phone}`,
        type: 1, // type = 1 for active account
        destinationId: newUser._id, // user id
        key: newUser?.email || newUser?.phone, // key = email or phone
        value: otp,
      },
    );

    if (newUser.email) {
      // send email verification
      this.mailService.SendCustomMail({
        to: newUser.email,
        subject: 'Email Verification',
        html: `
        <p>Your OTP code is <b>${otp}</b></p>
        <p>Or click this <a href="${this.configService.get('BACKEND_URl')}/auth/verify?id=${newTicket.id}&otp=${newTicket.value}">link</a> to verify your email</p>
        `,
      });
    } else if (newUser.phone) {
      // send sms verification
      // await this.smsService.sendSMS({ to: newUser.phone, message: `Your OTP code is ${otp}` });
    }

    return {
      success: true,
      data: {
        updateQueryParams: {
          ticketId: newTicket.id,
          authView: 'input-otp-form',
          from: 'signUp',
        },
      },
      message: 'User created successfully, Check your email or phone for OTP',
    };
  }

  @Post('verify')
  async verify(@Body() body: VerifyOtpDto) {
    const ticket = await this.authService.VerifyOtp(
      body.ticketId,
      body.ticketOtp,
    );

    let value = {};
    let message = '';
    // type = 0 for forgot password
    if (ticket.type === 0) {
      value = {
        ticketId: ticket.id,
        ticketOtp: ticket.value,
      };
      message = 'Verified for Forgot password successfully';
    }
    // // type = 1 for active account`
    // if (ticket.type === 1) {
    //   // update user
    //   const data = ticket.key.includes('@')
    //     ? { confirmEmail: true }
    //     : { confirmPhone: true };
    //   await this.userService.update(ticket.destinationId, data);
    //   // ticket canDelete
    //   await this.ticketService.remove(ticket.id);

    //   updateQueryParams = {
    //     authView: 'verify-success',
    //     from: 'verify-account',
    //     message: 'Verified for Active account successfully',
    //   };
    //   message = 'Verified for Active account successfully';
    // }

    return { value, message };
  }

  @Get('verify')
  async verifyGet(@Query() query: { id: string; otp: string }, @Res() res) {
    const ticket = await this.authService.VerifyOtp(query.id, query.otp);
    // type = 0 for forgot password
    if (ticket.type === 0) {
      return res.redirect(
        `${this.configService.get('FRONTEND_URL')}/auth/forgot-change-password?ticketId=${ticket.id}&ticketOtp=${ticket.value}`,
      );
    }
    // type = 1 for active account`
    if (ticket.type === 1) {
      // update user
      const data = ticket.key.includes('@')
        ? { confirmEmail: true }
        : { confirmPhone: true };
      await this.userService.update(ticket.destinationId, data);
      // ticket canDelete
      await this.ticketService.remove(ticket.id);
      return res.redirect(`${this.configService.get('FRONTEND_URL')}`);
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() input: { ticketId: string }) {
    const ticket = await this.ticketService.findOne(input.ticketId);

    if (!ticket) {
      throw new BadRequestException('Invalid ticketId');
    }

    const otp = await this.authService.generateOTP();

    // update ticket
    await this.ticketService.update(input.ticketId, { value: otp });

    if (ticket.key.includes('@')) {
      // send email with OTP
      this.mailService.SendCustomMail({
        to: ticket.key,
        subject: 'Your OTP Code for Forgot Password',
        html: `Your OTP code is <b>${otp}</b>`,
      });
    } else {
      // send sms with OTP
      // await this.smsService.sendSMS({ to: ticket.key, message: `Your OTP code is ${otp}` });
    }

    return {
      updateQueryParams: {
        ticketId: ticket.id,
        authView: 'input-otp-form',
        from: 'resend-otp',
      },

      message: 'OTP sent successfully',
    };
  }

  @Post('forgot-change-password')
  async forgotChangePassword(
    @CurrentUser() user,
    @Body() input: ForgotChangePasswordDto,
  ) {
    // verrify otp
    const ticket = await this.authService.VerifyOtp(
      input.ticketId,
      input.ticketOtp,
    );

  
    //find user
    const findUser = await this.userService.findById(ticket.destinationId);
    

    if (!findUser) {
      throw new BadRequestException('User not found');
    }

    // update password
    await this.userService.updatePassword(findUser.id, input.password);

    await this.ticketService.remove(ticket.id);

    return {
      message: 'Password changed successfully',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { account } = body;
    const isEmail = account.includes('@');

    const user = isEmail
      ? await this.userService.findByEmail(account)
      : await this.userService.findByPhone(account);

    if (!user) {
      throw new BadRequestException([
        { field: 'account', message: 'Tài khoản không tồn tại' },
      ]);
    }

    const otp = await this.authService.generateOTP();

    //new ticket
    const newTicket = await this.ticketService.findOneAndReplace(
      // condition
      {
        type: 0, // type = 0 for forgot password
        key: account,
      },
      // data
      {
        name: 'Forgot Password',
        destinationId: user._id, // user id
        description: `OTP for ${account}`,
        type: 0, // type = 0 for forgot password
        key: account, // key = email
        value: otp,
      },
    );
    // send email with OTP
    if (isEmail) {
      this.mailService.SendCustomMail({
        to: user.email,
        subject: 'Your OTP Code for Forgot Password',
        html: `Your OTP code is <b>${otp}</b>`,
      });
    } else {
      // send sms with OTP
      // await this.smsService.sendSMS({ to: user.phone, message: `Your OTP code is ${otp}` });
    }

    return {
      ticketId: newTicket.id,
      message: `OTP sent to ${account}`,
    };
  }

  // me
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProtected(@CurrentUser() user) {
    if (!user) {
      throw new UnauthorizedException('session expired');
    }
    const { email, name, roles, isAdmin, provider, avatarSrc, id } = user;

    const adminProfileMenu = isAdmin
      ? [{ icon: 'ServerIcon', title: 'Trang Quản Trị', url: '/dashboard' }]
      : [];

    return {
      user: {
        email,
        name,
        roles,
        isAdmin,
        provider,
        avatarSrc,
        id,
      },
      menu: {
        profile: [
          { icon: 'UserIcon', title: 'Tài khoản của tôi', url: '/profile' },
          ...adminProfileMenu,
        ],
        navItems: [
          { icon: 'HomeIcon', label: 'Home', url: '/dashboard' },
          {
            icon: 'DocumentIcon',
            label: 'Documents',
            url: '/dashboard/document/list',
          },
        ],
      },
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@CurrentUser() user, @Body() input: ChangePasswordDto) {
    // get password in db and compare old password in database
    const findUser = await this.userService.findById(user._id);

    const isPasswordValid = await this.userService.comparePassword(
      input.oldPassword,
      findUser.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid old password');
    }

    // update password

    await this.userService.updatePassword(user._id, input.newPassword);

    return {
      message: 'Password changed successfully',
    };
  }

  // SSO
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // This route is handled by Passport to initiate Google login.
    // 'redirectUrl' is passed dynamically from the frontend.
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = await this.userService.findOrCreateSSOUser(req.user);
    // Redirect or return JWT token here

    const token = await this.authService.createAccessToken(user);

    const referer = req?.headers?.referer || req?.Refererer;

    res
      .set('accessToken', token.accessToken)
      .redirect(
        302,
        `${referer}/auth/getToken?accessToken=${token.accessToken}`,
      );
    //return res.json(token); // You can handle redirection or return a token
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<void> {
    // Initiates the Facebook OAuth2 login flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req, @Res() res): Promise<void> {
    const user = await this.userService.findOrCreateSSOUser(req.user);
    const token = await this.authService.createAccessToken(user);
    // Handle redirect or return the JWT token
    res.json({ user, token }); // Return token or redirect the user as needed
  }
}
