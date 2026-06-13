import { Injectable, Logger, Inject } from '@nestjs/common';
import { CreateEmpresaDto } from '@app/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmpresasService {
  private readonly logger = new Logger(EmpresasService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  async createEmpresa(data: CreateEmpresaDto) {
    this.logger.log(`Creando empresa: ${data.nombre_legal}`);
    return this.prisma.empresa.create({
      data: {
        nombre_legal: data.nombre_legal,
        nombre_comercial: data.nombre_comercial,
        email_contacto: data.email_contacto,
        nif_cif: data.nif_cif,
      },
    });
  }

  async findOne(id_empresa: string) {
    try {
      return await this.prisma.empresa.findUnique({
        where: { id_empresa },
      });
    } catch (error) {
      return null;
    }
  }

  async findAll(empresaId?: string) {
    if (empresaId) {
      const empresa = await this.prisma.empresa.findUnique({
        where: { id_empresa: empresaId },
      });
      return empresa ? [empresa] : [];
    }
    return this.prisma.empresa.findMany({
      where: { activo: true },
    });
  }

  async update(id_empresa: string, data: Partial<CreateEmpresaDto>) {
    this.logger.log(`Actualizando empresa: ${id_empresa}`);
    return this.prisma.empresa.update({
      where: { id_empresa },
      data: {
        nombre_legal: data.nombre_legal,
        nombre_comercial: data.nombre_comercial,
        email_contacto: data.email_contacto,
        nif_cif: data.nif_cif,
      },
    });
  }

  async remove(id_empresa: string) {
    this.logger.log(`Destruyendo empresa y todos sus datos: ${id_empresa}`);
    
    // Notificar a ms-usuarios (y otros) para borrar datos atados a la empresa
    try {
      this.natsClient.emit('eliminar_datos_empresa', { empresaId: id_empresa });
    } catch (error) {
      this.logger.error('Error al notificar borrado de empresa', error);
    }
    
    // Finalmente eliminar la empresa de forma física
    return this.prisma.empresa.delete({
      where: { id_empresa },
    });
  }
}