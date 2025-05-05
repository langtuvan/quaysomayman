import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { UserService } from '../router/v1/user/user.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategy/GoogleStrategy';
import { FacebookStrategy } from './strategy/FacebookStrategy';
import { JwtStrategy } from './strategy/JwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailService } from 'src/Mailer/mail.service';
import { TicketService } from 'src/router/v1/ticket/ticket.service';
import { TicketModule } from 'src/router/v1/ticket/ticket.module';


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Load secret from .env
        signOptions: { expiresIn: '60000m' },
        global: true,
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TicketModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    MailService,
    GoogleStrategy,
    ConfigService,
    FacebookStrategy,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
