import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateProductoDto, INVENTARIO_PATTERNS } from '@app/common';

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
}