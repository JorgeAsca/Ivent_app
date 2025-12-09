import { Injectable,Logger, OnModuleInit, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg'; 
import { CreateEmpresaDto, CreateUsuarioDto, CreatePermisoDto } from '@app/common';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // Validación crítica: Si no hay URL, el Pool fallará silenciosamente o creará un adaptador inválido
    if (!connectionString) {
      throw new Error('DATABASE_URL no está definida en las variables de entorno');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // Llamada al constructor padre con el adaptador
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexión a Base de Datos establecida con Adaptador PG');
    } catch (error) {
      this.logger.error('Error conectando a la BD:', error);
      throw error;
    }
  }

  // --- EMPRESAS ---
  async createEmpresa(data: CreateEmpresaDto) {
    this.logger.log(`Creando empresa: ${data.nombre_legal}`);
    return this.empresa.create({
      data: {
        nombre_legal: data.nombre_legal,
        nombre_comercial: data.nombre_comercial,
        nif_cif: data.nif_cif,
      },
    });
  }

  // --- USUARIOS ---
  async createUsuario(data: CreateUsuarioDto) {
    this.logger.log(`Creando usuario: ${data.email}`);
    
    // Validar existencia por email
    const existe = await this.usuario.findUnique({ where: { email: data.email } });
    if (existe) throw new ConflictException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
        empresaId: data.empresaId, 
        
      },
    });
  }

  // --- PERMISOS ---
  async createPermiso(data: CreatePermisoDto) {
    this.logger.log(`Creando permiso: ${data.recurso} - ${data.accion}`);
    
    return this.permiso.create({
      data: {
        recurso: data.recurso,
        accion: data.accion
      }
    });
  }
}