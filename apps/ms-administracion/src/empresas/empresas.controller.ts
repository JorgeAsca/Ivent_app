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
}