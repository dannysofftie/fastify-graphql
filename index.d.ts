import { Browser } from 'puppeteer';
import { IConfig } from '@configs';
import { IFirebase } from '@libs/Firebase';
import { IPlugins } from '@plugins/index';
import { IJWTPayload } from '@plugins/Token';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        configs: IConfig;
        plugins: IPlugins;
        firebase: IFirebase;
        browser: Browser;
        prisma: PrismaClient;
    }

    interface FastifyRequest {
        user: IJWTPayload;
    }
}
