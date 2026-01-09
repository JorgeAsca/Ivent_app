import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@Controller()
export class MovimientosController {
    constructor(private readonly movimientosService: MovimientosService) { }

    @MessagePattern({ cmd: 'crear_movimiento_logistica' })
    async crear(@Payload() data: CreateMovimientoDto) {
        return await this.movimientosService.registrarMovimiento(data);
    }

    @MessagePattern({ cmd: 'obtener_movimientos_producto' })
    async obtenerPorProducto(@Payload() data: { id_producto: string }) {
        return await this.movimientosService.buscarPorProducto(data.id_producto);
    }
}