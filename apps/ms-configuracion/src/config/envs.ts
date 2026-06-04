import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const appEnv = path.resolve(process.cwd(), 'apps/ms-configuracion/.env');
const rootEnv = path.resolve(process.cwd(), '.env');
const envPath = fs.existsSync(appEnv) ? appEnv : rootEnv;

dotenv.config({ path: envPath });
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[]; 
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(), 
}).unknown(true);


const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  natsServers: envVars.NATS_SERVERS, 
};