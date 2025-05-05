import { MailerOptions } from '@nestjs-modules/mailer';


export const mailConfig: MailerOptions = {
  transport: {
    host: 'smtp.umailsmtp.com',
    port: 465,
    secure: true,
    auth: {
      user: 'no-reply@webnextapp.com',
      pass: 'AyZ247IlDyrc',
    },
    defaults: {
      from: '"No Reply" <no-reply@webnextapp.com>',
    },
    preview: true,
  },
};
