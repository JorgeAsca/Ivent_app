import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRolDto, AsignarPermisoRolDto } from '@app/common';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createRol(data: CreateRolDto) {
    this.logger.log(`Creando rol: ${data.nombre} para empresa: ${data.empresaId}`);
    return this.prisma.rol.create({
      data: {
        nombre: data.nombre,
        empresaId: data.empresaId,
      },
    });
  }

 
  async asignarPermiso(data: AsignarPermisoRolDto) {
    this.logger.log(`Asignando permiso ${data.permisoId} al rol ${data.rolId}`);

    
    const existe = await this.prisma.rolPermiso.findUnique({
        where: {
            id_rol_id_permiso: {
                id_rol: data.rolId,
                id_permiso: data.permisoId
            }
        }
    });

    if (existe) {
        return { message: 'El permiso ya estaba asignado a este rol' };
    }

    return this.prisma.rolPermiso.create({
      data: {
        id_rol: data.rolId,
        id_permiso: data.permisoId,
      },
      include: {
        permiso: true, 
      }
    });
  }
}