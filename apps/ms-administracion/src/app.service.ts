import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg'; 

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {
  
 constructor() {
    
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });

    
    const adapter = new PrismaPg(pool);

    
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async crearEmpresa(data: any) {
    return this.empresa.create({ data });
  }

  async crearRol(data: any) {
    const nuevoRol = await this.rol.create({
      data: {
        nombre: data.nombre,
        empresaId: data.empresaId,
      },
    });
    return nuevoRol;
  }
}