import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductoDto, INVENTARIO_PATTERNS } from '@app/common';
import { UpdateProductoDto } from './dto/update-producto.dto';   

@Controller()
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @MessagePattern({ cmd: 'get_dashboard_stats' })
    getDashboardStats() {
        return this.productosService.getDashboardStats();
    }

    @MessagePattern(INVENTARIO_PATTERNS.CREAR_PRODUCTO)
    create(@Payload() createProductoDto: CreateProductoDto) {
        return this.productosService.create(createProductoDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.LISTAR_PRODUCTOS)
    findAll() {
        return this.productosService.findAll();
    }

    @MessagePattern(INVENTARIO_PATTERNS.BUSCAR_PRODUCTO)
    findOne(@Payload() id: string) {
        return this.productosService.findOne(id);
    }

    @MessagePattern(INVENTARIO_PATTERNS.ACTUALIZAR_PRODUCTO)
    update(@Payload() updateProductoDto: UpdateProductoDto) {
        return this.productosService.update(updateProductoDto.id, updateProductoDto);
    }
    

    @MessagePattern(INVENTARIO_PATTERNS.ELIMINAR_PRODUCTO)
    remove(@Payload() id: string) {
        return this.productosService.remove(id);
    }

    @EventPattern({ cmd: 'sync_inventory_data' })
    handleSyncInventoryData(@Payload() data: { id_producto: string, stock_actual: number }) {
        return this.productosService.actualizarStockReal(data.id_producto, data.stock_actual);
    }
}