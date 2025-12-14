import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductoDto, INVENTARIO_PATTERNS } from '@app/common'; 

@Controller()
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @MessagePattern(INVENTARIO_PATTERNS.CREAR_PRODUCTO)
    create(@Payload() createProductoDto: CreateProductoDto) {
        return this.productosService.create(createProductoDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.LISTAR_PRODUCTOS)
    findAll() {
        return this.productosService.findAll();
    }
}