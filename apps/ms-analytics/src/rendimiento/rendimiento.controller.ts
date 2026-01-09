import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RendimientoService } from './rendimiento.service';
import { CreateRendimientoDto } from './dto/create-rendimiento.dto';

@Controller()
export class RendimientoController {
    constructor(private readonly service: RendimientoService) { }

    @MessagePattern({ cmd: 'log_performance' })
    logPerformance(@Payload() dto: CreateRendimientoDto) {
        return this.service.registrarMetrica(dto);
    }
}