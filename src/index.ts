import * as cluster from 'cluster';
import * as moduleAlias from 'module-alias';
import * as os from 'os';

moduleAlias.addAliases({
  '@configs': `${__dirname}/configs`,
  '@docs': `${__dirname}/docs`,
  '@libs': `${__dirname}/libs`,
  '@hooks': `${__dirname}/hooks`,
  '@models': `${__dirname}/models`,
  '@queries': `${__dirname}/queries`,
  '@mutations': `${__dirname}/mutations`,
  '@schema': `${__dirname}/schema`,
  '@plugins': `${__dirname}/plugins`,
  '@rules': `${__dirname}/rules`,
});

import App from './bin/www';

const fastify = new App();

// run app in cluster mode in a production environment
if (process.env.NODE_ENV === 'production')
  if (cluster.isMaster) {
    for (const _cpu of os.cpus()) {
      cluster.fork();
    }
  } else {
    fastify.start();
  }
else fastify.start();
