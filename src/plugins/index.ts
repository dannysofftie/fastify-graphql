import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { buildXLSX, IBuildXLSX } from './BuildXLSX';
import { ICsvparser, parseCsv } from './ParseCSV';
import { IMessageArguments, smsToPhoneNumber } from './Sms';
import { compileEjs, ICompileTemplate } from './Template';
import { decodeJwtToken, IJWTPayload, IJWTToken, token } from './Token';

// tslint:disable-next-line: no-empty-interface
export interface IPlugins extends ICompileTemplate, ICsvparser, IBuildXLSX {
  jwt: IJWTToken;
  /**
   * Decode JWT token from request authorization header.
   *
   * @param {FastifyInstance} app
   * @param {FastifyRequest} req
   */
  decodeJwtToken(app: FastifyInstance, req: FastifyRequest): IJWTPayload;

  /**
   * Format phone number
   *
   * @param {string} phone
   */
  formatPhoneNumber(phone: string): string;
  /**
   * Validate email address
   *
   * @param {string} email
   */
  validateEmailAddress(email: string): boolean;
  /**
   * Format sentence or words to pascal case
   *
   * @param words
   */
  toPascalCase(words: string): string;
  /**
   * Send SMS to phone number
   *
   * @param {IMessageArguments} args
   */
  smsToPhoneNumber(args: IMessageArguments): Promise<any>;
}

const toPascalCase = (words: string): string => {
  if (/n\/a/gi.test(words?.trim())) {
    return words?.trim()?.toUpperCase();
  }
  return words
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => w.substring(0, 1).toUpperCase() + w.substring(1).toLowerCase())
    .join(' ');
};

const validateEmailAddress = (email: string = ''): boolean => {
  email = email.replace(/\s/g, '').toLowerCase();
  if (!email) {
    return false;
  }
  return /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
};

const formatPhoneNumber = (phone: string = ''): string => {
  phone = phone.replace(/\s|\)|\(/g, '');
  if (!phone.trim().length) {
    return '';
  }
  // ensure phone number has 9 or more characters and is a number
  if (phone.length < 9 || Number.isNaN(Number(phone))) throw new Error('Phone number is invalid');

  const prefix = phone.startsWith('+');
  if (prefix) {
    return phone.replace(/\s|\(|\)|-/g, '');
  }
  return `+254${phone.replace(/\s|\(|\)|-/g, '').slice(-9)}`;
};

export default fp(async (app, opts) => {
  app.decorate('plugins', { compileEjs, parseCsv, buildXLSX, jwt: token, decodeJwtToken, formatPhoneNumber, validateEmailAddress, toPascalCase, smsToPhoneNumber });
});
