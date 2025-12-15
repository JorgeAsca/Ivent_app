import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
// Asegúrate de exportar CreateCategoriaDto en tu librería @app/common
import { CreateProductoDto, INVENTARIO_PATTERNS, CreateCategoriaDto } from '@app/common'; 

@Controller('inventario')
export class InventarioController {
    constructor(
        @Inject('INVENTARIO_SERVICE') private readonly clientInventario: ClientProxy,
    ) { }

    
    @Post('productos')
    createProducto(@Body() createProductoDto: CreateProductoDto) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.CREAR_PRODUCTO, createProductoDto).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }

    @Get('productos')
    findAllProductos() {
        return this.clientInventario.send(INVENTARIO_PATTERNS.LISTAR_PRODUCTOS, {}).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }


    @Post('categorias')
    createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.CREAR_CATEGORIA, createCategoriaDto).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }

    @Get('categorias')
    findAllCategorias() {
        return this.clientInventario.send(INVENTARIO_PATTERNS.LISTAR_CATEGORIAS, {}).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }
}