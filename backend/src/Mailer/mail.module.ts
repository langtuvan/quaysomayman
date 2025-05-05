import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { mailConfig } from './mail.config';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [MailerModule.forRoot(mailConfig)],
  exports: [MailerModule],
})
export class MailModule {}
