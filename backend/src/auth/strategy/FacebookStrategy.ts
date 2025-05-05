import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { VerifyCallback } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService<ConfigServiceModel>) {
    super({
      clientID: configService.get('FACEBOOK_AUTH_CLIENT_ID'), //'3979148588983182', //configService.get('FACEBOOK_AUTH_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_AUTH_CLIENT_SECRET'), //'97eb49f118e4a884b7b6eb7573b3e74d', //configService.get('FACEBOOK_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('FACEBOOK_AUTH_CALLBACK_URL'), //'http://localhost:5000/auth/facebook/callback', //configService.get('FACEBOOK_AUTH_CALLBACK_URL'),
      profileFields: ['id', 'emails', 'name'], // The fields you want from Facebook
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, name } = profile;
    const user = {
      provider: 'facebook',
      providerId: id,
      email: emails ? emails[0].value : null,
      name: `${name.givenName} ${name.familyName}`,
      accessToken,
    };
    done(null, user);
  }
}
