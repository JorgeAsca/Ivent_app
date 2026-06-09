import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@Controller()
export class MovimientosController {
    constructor(private readonly movimientosService: MovimientosService) { }

    @MessagePattern({ cmd: 'crear_movimiento' }) // Asegúrate de que los espacios y comillas coincidan
    async create(@Payload() createMovimientoDto: CreateMovimientoDto) {
        console.log('Microservicio Logística: Recibido comando crear_movimiento', createMovimientoDto);
        return await this.movimientosService.registrarMovimiento(createMovimientoDto);
    }
    @MessagePattern({ cmd: 'obtener_movimientos_producto' })
    async obtenerPorProducto(@Payload() data: { id_producto: string }) {
        return await this.movimientosService.buscarPorProducto(data.id_producto);
    }

    @MessagePattern({ cmd: 'listar_movimientos' })
    async findAll(@Payload() data: { id_empresa: string }) {
        return await this.movimientosService.findAll(data.id_empresa);
    }
}