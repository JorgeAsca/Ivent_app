import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductoDto, INVENTARIO_PATTERNS } from '@app/common';
import { UpdateProductoDto } from './dto/update-producto.dto';   

@Controller()
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @MessagePattern({ cmd: 'get_dashboard_stats' })
    getDashboardStats(@Payload() payload: { id_empresa: string }) {
        return this.productosService.getDashboardStats(payload.id_empresa);
    }

    @MessagePattern(INVENTARIO_PATTERNS.CREAR_PRODUCTO)
    create(@Payload() createProductoDto: any) {
        return this.productosService.create(createProductoDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.LISTAR_PRODUCTOS)
    findAll(@Payload() payload: { id_empresa: string }) {
        return this.productosService.findAll(payload.id_empresa);
    }

    @MessagePattern(INVENTARIO_PATTERNS.BUSCAR_PRODUCTO)
    findOne(@Payload() payload: { id: string, id_empresa: string }) {
        return this.productosService.findOne(payload.id, payload.id_empresa);
    }

    @MessagePattern(INVENTARIO_PATTERNS.ACTUALIZAR_PRODUCTO)
    update(@Payload() updateProductoDto: any) {
        return this.productosService.update(updateProductoDto.id, updateProductoDto.id_empresa, updateProductoDto);
    }
    

    @MessagePattern(INVENTARIO_PATTERNS.ELIMINAR_PRODUCTO)
    remove(@Payload() payload: { id: string, id_empresa: string }) {
        return this.productosService.remove(payload.id, payload.id_empresa);
    }

    @EventPattern({ cmd: 'sync_inventory_data' })
    handleSyncInventoryData(@Payload() data: { id_producto: string, stock_actual: number, id_empresa: string }) {
        return this.productosService.actualizarStockReal(data.id_producto, data.stock_actual, data.id_empresa);
    }
}