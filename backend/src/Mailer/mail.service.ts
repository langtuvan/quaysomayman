import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async SendCustomMail(params: {
    from?: string;
    to: string;
    subject: string;
    text?: string;
    html: string;
  }): Promise<void> {
    const {
      from = '"No Reply - Web Next App" <no-replay@webnextapp.com>',
      to,
      subject,
      text,
      html,
    } = params;
    try {
      await this.mailerService.sendMail({
        from,
        to,
        html,
        subject,
        text,
      });
    } catch (error) {
      // Log error
      throw new BadRequestException('sendMail is fail');
    }
  }
}
