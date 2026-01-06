import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DireccionesService } from './direcciones.service';
import { CreateDireccionDto } from './dto/create-direccion.dto';

@Controller()
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  @MessagePattern({ cmd: 'create_direccion' })
  create(@Payload() createDireccionDto: CreateDireccionDto) {
    return this.direccionesService.create(createDireccionDto);
  }

  @MessagePattern({ cmd: 'find_direcciones_by_entidad' })
  findByEntidad(@Payload() data: { entidad_id: string; tipo_entidad: string }) {
    return this.direccionesService.findByEntidad(data.entidad_id, data.tipo_entidad);
  }
}