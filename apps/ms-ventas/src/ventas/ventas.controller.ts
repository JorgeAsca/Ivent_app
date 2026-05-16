import { Controller } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class VentasController {
    constructor(private readonly ventasService: VentasService) { }

    @MessagePattern({ cmd: 'create_venta' })
    create(@Payload() createVentaDto: CreateVentaDto) {
        return this.ventasService.create(createVentaDto);
    }
}