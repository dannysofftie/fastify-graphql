import { configs } from '@configs';
import plugins from '@plugins/index';
import libraries from '@libs/index';
import { compileEjs } from '@plugins/Template';
import { schema } from '@schema/index';
import altairPlugin from 'altair-fastify-plugin';
import fastify, { FastifyInstance } from 'fastify';
import cors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import mercurius from 'mercurius';
import mercuriusCodegen from 'mercurius-codegen';
import { join } from 'path';

export default class App {
  private app: FastifyInstance;

  constructor() {
    this.app = fastify({ ignoreTrailingSlash: true, logger: false });
    this.config();
  }

  async config(): Promise<void> {
    this.app.setErrorHandler((err, req, res) => {
      console.log(err, req.raw.url, req.params);
      res.send(err);
    });

    // register fastify plugins
    await this.app.register(cors, { preflight: true, credentials: true, origin: true });
    await this.app.register(fastifyStatic, { root: join(__dirname, '..', '..', 'public'), prefix: '/public', wildcard: true, decorateReply: false, schemaHide: true });
    await this.app.register(fastifyStatic, { root: join(__dirname, '..', '..', 'uploads'), prefix: '/uploads', wildcard: true, decorateReply: false, schemaHide: true });
    await this.app.register(plugins);
    await this.app.register(libraries);

    // add user object to fastify context
    this.app.addHook('onRequest', async (req, res) => {
      res.user = this.app.plugins.decodeJwtToken(this.app, req);
    });

    // register mercurius and graphql ide (altair)
    // @ts-expect-error this is to return custom error and remove stack trace
    await this.app.register(mercurius, {
      schema,
      path: '/graphql',
      queryDepth: 8,
      ide: false,
      graphiql: false,
      errorFormatter: execution => {
        const errors = execution.errors.map(a => ({ name: a.originalError?.name, message: a.originalError?.message })).filter(b => b.message);
        let statusCode = 404;

        switch (true) {
          case errors.map(a => a.name).includes('MISSING_TOKEN'):
            statusCode = 401;
            break;
          case errors.map(a => a.name).includes('PRIVILEGE'):
            statusCode = 403;
            break;

          // other error codes here
          // default to server error code
          default:
            statusCode = 500;
            break;
        }

        return {
          statusCode,
          response: {
            data: execution.data,
            errors: Object.keys(errors).length ? errors : execution.errors?.map(a => ({ name: 'SERVER_ERROR', message: a?.message })),
          },
        };
      },
    });

    await this.app.register(altairPlugin, { endpointURL: '/graphql', path: '/api/docs', baseURL: '/api/docs/', initialSettings: { theme: 'dark' } });

    // generate schema in development to improve tooling
    process.env.NODE_ENV !== 'production' && mercuriusCodegen(this.app, { targetPath: join(process.cwd(), 'graphql', 'index.d.ts'), codegenConfig: { useIndexSignature: true } });

    // respond with 404 for unhandled paths
    this.app.get('*', { preHandler: [] }, (req, res) => {
      const html = compileEjs({ template: '404-page' })(null);
      res.type('text/html').send(html);
    });
  }

  async start(): Promise<void> {
    await this.app.listen(configs.port as number, '0.0.0.0').catch(console.log);

    // graceful shutdown of all attached processes
    // 1. attached puppeteer browser instance
    // 2. attached prisma client to disconnect and close
    // 3. attached redis instance to disconnect and close
    for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as NodeJS.Signals[]) {
      process.on(signal, () => process.exit());
    }

    console.log(`🚀 Server listening on`, this.app.server.address());
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
  }
}
