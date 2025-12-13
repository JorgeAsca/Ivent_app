import 'dotenv/config';
import * as joi from 'joi';


process.env.ENV_FILE_PATH
    ? require('dotenv').config({ path: process.env.ENV_FILE_PATH })
    : require('dotenv').config({ path: './apps/ms-administracion/deploy/.env' });

interface EnvVars {
    PORT: number;
    DB_URL: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    
    DATABASE_URL: joi.string().required(),
})
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DB_URL,
};