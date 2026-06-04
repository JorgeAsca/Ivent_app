import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const appEnv = path.resolve(process.cwd(), 'apps/ms-administracion/.env');
const rootEnv = path.resolve(process.cwd(), '.env');
const deployEnv = './apps/ms-administracion/deploy/.env';

const envPath = process.env.ENV_FILE_PATH && fs.existsSync(process.env.ENV_FILE_PATH)
  ? process.env.ENV_FILE_PATH
  : fs.existsSync(appEnv)
    ? appEnv
    : fs.existsSync(rootEnv)
      ? rootEnv
      : fs.existsSync(deployEnv)
        ? deployEnv
        : undefined;

if (envPath) {
  dotenv.config({ path: envPath });
}
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DB_URL: string;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
})
    .unknown(true);

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
    databaseUrl: envVars.DB_URL,
    natsServers: envVars.NATS_SERVERS,
};