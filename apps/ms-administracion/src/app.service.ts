import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg'; 

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {
  
 constructor() {
    const connectionString = process.env.DATABASE_URL;

    
    // console.log('------------------------------------------------');
    // console.log('INTENTANDO CONECTAR A LA DB:', connectionString); 
    // console.log('------------------------------------------------');
   

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

  async createEmpresa(data: any) {
    
    return this.empresa.create({
      data: data,
    });
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