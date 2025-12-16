import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateProductoDto, UpdateProductoDto, CreateCategoriaDto, UpdateCategoriaDto, INVENTARIO_PATTERNS } from '@app/common';

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
    @Get('productos/:id')
    findOneProducto(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.BUSCAR_PRODUCTO, id)
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Patch('productos/:id')
    updateProducto(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductoDto: UpdateProductoDto) {
        // Combinamos el ID de la URL con el cuerpo para enviarlo al microservicio
        return this.clientInventario.send(INVENTARIO_PATTERNS.ACTUALIZAR_PRODUCTO, { id, ...updateProductoDto })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Delete('productos/:id')
    removeProducto(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ELIMINAR_PRODUCTO, id)
            .pipe(catchError(err => { throw new RpcException(err) }));
    }


    // Peticiones de categoria 
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

    @Get('categorias/:id')
    findOneCategoria(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.BUSCAR_CATEGORIA, id)
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Patch('categorias/:id')
    updateCategoria(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ACTUALIZAR_CATEGORIA, { id, ...updateCategoriaDto })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Delete('categorias/:id')
    removeCategoria(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ELIMINAR_CATEGORIA, id)
            .pipe(catchError(err => { throw new RpcException(err) }));
    }


}