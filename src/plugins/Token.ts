import { Role } from '@prisma/client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { configs } from '../configs';

/**
 * Payload expected by JWT's sign token function.
 *
 * @interface IJWTPayload
 */
export interface IJWTPayload {
  email: string;
  id: string;
  role: Role;
  phone?: string;
}

export interface IJWTToken {
  /**
   * Use JWT to sign a token
   */
  sign: (options: IJWTPayload) => string;
  /**
   * Verify token, and get passed in variables
   */
  verify: (token: string) => IJWTPayload | string;
}

/**
 * JWT tokens signing, verification and decoding utility.
 *
 * @export
 * @class Token
 */
export const token = {
  /**
   * Use JWT to sign a token
   */
  sign: (options: IJWTPayload | string): string => {
    if (!options) {
      throw new Error('Expects email, account type and id in payload.');
    }

    return jwt.sign(options, { key: configs.jwt.private, passphrase: configs.jwt.passphrase }, { algorithm: 'RS256' });
  },
  /**
   * Verify token, and get passed in variables
   */
  verify: (tokn: string): IJWTPayload => {
    if (!tokn) return null;
    try {
      return jwt.verify(tokn, configs.jwt.public, { algorithms: ['RS256'] }) as IJWTPayload;
    } catch (error) {
      return null;
    }
  },
};

/**
 * Determine account, and user type from the incoming request.
 *
 * @export
 */
export function decodeJwtToken(app: FastifyInstance, req: FastifyRequest) {
  const auth = req.headers?.['authorization'];
  const token = auth?.split(' ')?.[0] === 'Bearer' ? auth?.split(' ')?.[1] : auth;
  return app.plugins.jwt.verify(token);
}

// console.log(token.sign(configs.appdomainAdminAuthKey));
