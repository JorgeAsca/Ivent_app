import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ADMIN_PATTERNS, CreateEmpresaDto } from '@app/common';
import { EmpresasService } from './empresas.service';

@Controller()
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @MessagePattern(ADMIN_PATTERNS.CREAR_EMPRESA)
  async createEmpresa(@Payload() data: CreateEmpresaDto) {
    return this.empresasService.createEmpresa(data);
  }

  @MessagePattern({ cmd: 'validar_empresa' })
  async validarEmpresa(@Payload() data: { id_empresa: string }) {
    const empresa = await this.empresasService.findOne(data.id_empresa);
    return !!empresa; // Devuelve true si existe, false si no
  }
}