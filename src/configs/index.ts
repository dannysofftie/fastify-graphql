import * as dotenv from 'dotenv';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

dotenv.config();

export interface IConfig {
    port: string | number;
    apiurl: string;
    firebaseAccountJsonFile: string;
    jwtsecret: string;
}

export const configs: IConfig = {
    port: process.env.PORT || 4000,
    apiurl: process.env.NODE_ENV === 'production' ? process.env.PROD_API_URL : process.env.STAGING_API_URL,
    firebaseAccountJsonFile: process.env.NODE_ENV,
    jwtsecret: process.env.JWT_SECRET,
};

export default fp((app: FastifyInstance, _opts: unknown, done: (err?: Error) => void) => {
    app.decorate('configs', configs);

    done();
});
