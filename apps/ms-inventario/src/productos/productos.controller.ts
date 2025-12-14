import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';

@Controller()
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @MessagePattern('crear_producto')
    create(@Payload() createProductoDto: CreateProductoDto) {
        return this.productosService.create(createProductoDto);
    }

    @MessagePattern('listar_productos')
    findAll() {
        return this.productosService.findAll();
    }
}