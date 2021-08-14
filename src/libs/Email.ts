import { configs } from '@configs';
import { ReadStream } from 'fs';
import { minify } from 'html-minifier';
import { createTransport } from 'nodemailer';
import { join } from 'path';

const gsuite = false;
const serviceKey = require(join(process.cwd(), 'conf', 'app-api-service.json'));

export interface IEmailOptions {
  recipients: string | string[];
  message: string | Buffer;
  subject: string;
  fromtext: string;
  tocustomname: string;
  attachments?: { filename: string; content: ReadStream }[];
}

const transport = createTransport({
  host: configs.email.host,
  secure: true,
  port: configs.port as number,
  auth: {
    user: configs.email.address,
    ...(!gsuite && { pass: configs.email.password }),
    ...(!!gsuite && { type: 'OAuth2', privateKey: serviceKey['private_key'], serviceClient: serviceKey['client_id'] }),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmailMessage = async (emailopts: IEmailOptions) => {
  const delivery = [];
  if (typeof emailopts.recipients === 'string') {
    return await transport.sendMail({
      html: minify(emailopts.message as string, { collapseWhitespace: true }),
      to: `${emailopts.tocustomname} <${emailopts.recipients}>`,
      from: `${emailopts.fromtext} <${configs.email.address}>`,
      subject: emailopts.subject,
      replyTo: configs.email.address,
      attachments: emailopts.attachments,
    });
  }

  for (const recipient of emailopts.recipients) {
    const res = await transport.sendMail({
      html: minify(emailopts.message as string, { collapseWhitespace: true }),
      to: `${recipient} <${recipient}>`,
      from: `${emailopts.fromtext} <${configs.email.address}>`,
      subject: emailopts.subject,
      replyTo: configs.email.address,
      attachments: emailopts.attachments,
    });
    delivery.push(res);
  }
  return delivery;
};
