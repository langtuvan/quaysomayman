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
