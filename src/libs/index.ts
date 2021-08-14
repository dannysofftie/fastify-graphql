import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';
import puppeteer from 'puppeteer';
import { IEmailOptions, sendEmailMessage } from './Email';
import firebaseFuncs, { IFirebase } from './Firebase';

export interface ILibraries {
  firebase: IFirebase;
  prisma: PrismaClient;
  sendEmailMessage: (emailopts: IEmailOptions) => Promise<any>;
  browser: puppeteer.Browser;
}

export default fp(async (app, _opts) => {
  const prisma = new PrismaClient();
  await prisma
    .$connect()
    .then(() => console.log('🚀 Prisma connected'))
    .catch(console.log);

  const browser = await puppeteer
    .launch({
      ...(process.env.PUPPETEER_ENV === 'docker' && {
        executablePath: '/usr/bin/google-chrome-stable',
        userDataDir: './.chrome',
      }),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--disable-gpu'],
    })
    .then(instance => {
      console.log('🚀 Puppeteer started in headless mode');
      return instance;
    });

  /**
   * Install dependencies to run chromium in Linux boxes
   *
   * sudo apt install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
   * libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 \
   * libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
   * libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
   */

  app.decorate('libs', { firebase: firebaseFuncs, prisma, sendEmailMessage, browser });
});
