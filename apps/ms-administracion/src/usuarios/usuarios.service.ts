import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from '@app/common';
import { AsignarPermisoRolDto } from '@app/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUsuario(data: CreateUsuarioDto) {
    this.logger.log(`Creando usuario: ${data.email}`);
    
    const existe = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (existe) throw new ConflictException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
        empresaId: data.empresaId,
        rolId: data.rolId,
      },
      include: {
        rol: true,
      },
    });
  }
}