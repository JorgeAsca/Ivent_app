import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const appEnv = path.resolve(process.cwd(), 'apps/ms-gateway/.env');
const rootEnv = path.resolve(process.cwd(), '.env');
const envPath = fs.existsSync(appEnv) ? appEnv : rootEnv;

dotenv.config({ path: envPath });
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
})
    .unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    // Transformamos la cadena del .env en un array
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
};