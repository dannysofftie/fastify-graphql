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
    verify: (token: string) => IJWTPayload;
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
    sign: (options: IJWTPayload): string => {
        const { email, id, role, phone }: IJWTPayload = options;

        if (!id || !role) {
            throw new Error('Expects email, account type and id in payload.');
        }

        return jwt.sign({ email, id, role, phone }, configs.jwtsecret);
    },
    /**
     * Verify token, and get passed in variables
     */
    verify: (tokn: string): IJWTPayload => {
        try {
            return jwt.verify(tokn, configs.jwtsecret) as IJWTPayload;
        } catch (error) {
            return { email: null, role: null, id: null };
        }
    },
};

/**
 * Determine account, and user type from the incoming request.
 *
 * @export
 */
export function decodeJwtToken(app: FastifyInstance, req: FastifyRequest): IJWTPayload {
    const auth = req.headers['authorization'];

    try {
        const token = auth.split(' ')[0] === 'Bearer' ? auth.split(' ')[1] : auth;
        return app.plugins.verify(token);
    } catch {
        return { id: null, role: null, email: null, phone: null };
    }
}
