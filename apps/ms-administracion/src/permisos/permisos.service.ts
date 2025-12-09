import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermisoDto } from '@app/common';

@Injectable()
export class PermisosService {
  private readonly logger = new Logger(PermisosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPermiso(data: CreatePermisoDto) {
    this.logger.log(`Creando permiso: ${data.recurso} - ${data.accion}`);
    
    return this.prisma.permiso.create({
      data: {
        recurso: data.recurso,
        accion: data.accion
      }
    });
  }
}