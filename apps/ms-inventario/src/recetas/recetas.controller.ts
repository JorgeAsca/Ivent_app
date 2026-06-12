import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';

@Controller()
export class RecetasController {
    constructor(private readonly recetasService: RecetasService) { }

    @MessagePattern({ cmd: 'guardar_receta' })
    guardarReceta(@Payload() data: CreateRecetaDto) {
        return this.recetasService.guardarReceta(data);
    }

    @MessagePattern({ cmd: 'obtener_receta' })
    obtenerReceta(@Payload() data: { producto_id: string, id_empresa: string }) {
        return this.recetasService.obtenerReceta(data.producto_id, data.id_empresa);
    }

    @MessagePattern({ cmd: 'calcular_rendimiento' })
    calcularRendimiento(@Payload() data: { producto_id: string, id_empresa: string }) {
        return this.recetasService.calcularRendimiento(data.producto_id, data.id_empresa);
    }

    @MessagePattern({ cmd: 'fabricar_producto' })
    fabricarProducto(@Payload() data: { producto_id: string, cantidad: number, id_almacen_destino: string, id_empresa: string }) {
        return this.recetasService.fabricarProducto(data.producto_id, data.cantidad, data.id_almacen_destino, data.id_empresa);
    }
}
