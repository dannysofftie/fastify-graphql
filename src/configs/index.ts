import * as dotenv from 'dotenv';
import fp from 'fastify-plugin';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

export interface IConfig {
  port: string | number;
  apiurl: string;
  firebaseAccountJsonFile: string;
  totpSecretKey: string;
  email: {
    host: string;
    port: number;
    address: string;
    password: string;
  };
  defaultPassword: string;
  jwt: {
    private: string;
    public: string;
    passphrase: string;
  };
  africasTalkingUsername: string;
  africasTalkingApiKey: string;
  endpoints: {
    sandboxUrl: string;
    productionUrl: string;
    tokenUrl: string;
  };
  systemAdminAuthKey: string;
}

export const configs: IConfig = {
  port: process.env.PORT || 4000,
  apiurl: process.env.NODE_ENV === 'production' ? process.env.PROD_API_URL : process.env.STAGING_API_URL,
  firebaseAccountJsonFile: require(join(process.cwd(), 'conf', 'app-api-service.json')),
  jwt: {
    private: readFileSync(join(process.cwd(), 'conf', 'certs', 'private.pem'), 'utf-8'),
    public: readFileSync(join(process.cwd(), 'conf', 'certs', 'public.pem'), 'utf-8'),
    passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
  },
  totpSecretKey: process.env.TOTP_SECRET_KEY,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_HOST?.includes('gmail') || process.env.EMAIL_HOST?.includes('zoho') ? 465 : 25,
    address: process.env.EMAIL_ADDRESS,
    password: process.env.EMAIL_PASSWORD,
  },
  defaultPassword: process.env.USER_DEFAULT_PASSWORD,
  africasTalkingApiKey: process.env.AFRICAS_TALKING_API_KEY,
  africasTalkingUsername: process.env.AFRICAS_TALKING_USERNAME,
  endpoints: {
    sandboxUrl: 'https://sandbox.africastalking.com/version1/messaging',
    productionUrl: 'https://api.africastalking.com/version1/messaging',
    tokenUrl: 'https://api.africastalking.com/auth-token/generate',
  },
  systemAdminAuthKey: process.env.SYSTEM_ADMIN_AUTH_KEY,
};

export default fp(async (app, _opts) => {
  app.decorate('configs', configs);
});
