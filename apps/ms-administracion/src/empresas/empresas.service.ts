import { Injectable, Logger } from '@nestjs/common';
import { CreateEmpresaDto } from '@app/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpresasService {
  private readonly logger = new Logger(EmpresasService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createEmpresa(data: CreateEmpresaDto) {
    this.logger.log(`Creando empresa: ${data.nombre_legal}`);
    return this.prisma.empresa.create({
      data: {
        nombre_legal: data.nombre_legal,
        nombre_comercial: data.nombre_comercial,
        nif_cif: data.nif_cif,
      },
    });
  }
}