import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    let connectionString = process.env.DATABASE_URL;
    
    // In Docker, .env might overwrite process.env.DATABASE_URL with localhost. 
    // If DB_HOST is set (from docker-compose), construct the correct URL.
    if (process.env.DB_HOST && connectionString && connectionString.includes('localhost')) {
        connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?schema=public`;
    }

    if (!connectionString) {
      throw new Error('DATABASE_URL no está definida en las variables de entorno');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`Conexión a Base de Datos establecida con pool. connectionString=${process.env.DB_HOST ? 'Docker' : 'Local'}`);
    } catch (error) {
      this.logger.error('Error conectando a la BD:', error);
      throw error;
    }
  }
}