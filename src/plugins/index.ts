import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import * as LRU from 'lru-cache';
import { buildXLSX, IBuildXLSX } from './BuildXLSX';
import { ICsvparser, parseCsv } from './ParseCSV';
import { compileEjs, ICompileTemplate } from './Template';
import { decodeJwtToken, IJWTPayload, IJWTToken, token } from './Token';

// tslint:disable-next-line: no-empty-interface
export interface IPlugins extends ICompileTemplate, ICsvparser, IBuildXLSX, IJWTToken {
    cache: LRU<string, unknown>;

    /**
     * Obtain cache key for the current request. Stringifies user id and routerPath.
     *
     * If `intent` is specified as `GET`, this will method will retrieve data for identified key from cache and return it
     *
     * @param {FastifyInstance} app
     * @param {FastifyRequest} req
     * @param {'GET' | 'SET'} intent
     */
    cacheKeySerializer(app: FastifyInstance, req: FastifyRequest, intent?: 'GET' | 'SET'): unknown;

    /**
     * Clear cache for specified keys
     *
     * @param {string[]} keys
     */
    clearCacheForKeys(keys: string[]): void;

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
     * Custom error formatter.
     *
     * @param {string} name
     * @param {string} message
     */
    throwError(name: string, message: string): Error;
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

const validateEmailAddress = (email: string): boolean => {
    if (!email) {
        return false;
    }
    return /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
};

const formatPhoneNumber = (phone: string): string => {
    if (!phone.length) {
        return '';
    }

    phone = phone.replace(/\s|\)|\(/g, '');

    const prefix = phone.startsWith('+');

    if (prefix) {
        return phone?.replace(/\s|\(|\)|-/g, '');
    }

    return `+254${phone?.replace(/\s|\(|\)|-/g, '').slice(-9)}`;
};

const throwError = (name: string, message: string): Error => {
    const error = new Error(message);
    error.name = name;
    return error;
};

export default fp((app: FastifyInstance, _opts: unknown, done: (err?: Error) => void) => {
    app.decorate('plugins', { compileEjs, parseCsv, buildXLSX, ...token, decodeJwtToken, formatPhoneNumber, validateEmailAddress, toPascalCase, throwError });
    done();
});
