import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, ParseUUIDPipe, Req } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateProductoDto, UpdateProductoDto, CreateCategoriaDto, UpdateCategoriaDto, INVENTARIO_PATTERNS } from '@app/common';

@Controller('inventario')
export class InventarioController {
    constructor(
        @Inject('NATS_SERVICE') private readonly clientInventario: ClientProxy,
    ) { }

    @Post('productos')
    createProducto(@Body() createProductoDto: CreateProductoDto, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.CREAR_PRODUCTO, { ...createProductoDto, id_empresa: req.user.empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }

    @Get('productos')
    findAllProductos(@Req() req: any) {
        const empresaId = req.user?.empresaId || '05d04ccf-1785-4db2-a9b0-a614002e2101';
        return this.clientInventario.send(INVENTARIO_PATTERNS.LISTAR_PRODUCTOS, { id_empresa: empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }

    @Get('productos/:id')
    findOneProducto(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.BUSCAR_PRODUCTO, { id, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Patch('productos/:id')
    updateProducto(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductoDto: UpdateProductoDto, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ACTUALIZAR_PRODUCTO, { id, ...updateProductoDto, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Delete('productos/:id')
    removeProducto(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ELIMINAR_PRODUCTO, { id, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    // Peticiones de categoria 
    @Post('categorias')
    createCategoria(@Body() createCategoriaDto: CreateCategoriaDto, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.CREAR_CATEGORIA, { ...createCategoriaDto, id_empresa: req.user.empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }

    @Get('categorias')
    findAllCategorias(@Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.LISTAR_CATEGORIAS, { id_empresa: req.user.empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); }),
        );
    }

    @Get('categorias/:id')
    findOneCategoria(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.BUSCAR_CATEGORIA, { id, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Patch('categorias/:id')
    updateCategoria(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoriaDto: UpdateCategoriaDto, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ACTUALIZAR_CATEGORIA, { id, ...updateCategoriaDto, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Delete('categorias/:id')
    removeCategoria(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.clientInventario.send(INVENTARIO_PATTERNS.ELIMINAR_CATEGORIA, { id, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    // Peticiones de Recetas (BOM)
    @Get('productos/:id/receta')
    obtenerReceta(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.clientInventario.send({ cmd: 'obtener_receta' }, { producto_id: id, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Post('productos/:id/receta')
    guardarReceta(@Param('id', ParseUUIDPipe) id: string, @Body() data: any, @Req() req: any) {
        return this.clientInventario.send({ cmd: 'guardar_receta' }, { producto_id: id, ...data, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Get('productos/:id/rendimiento')
    calcularRendimiento(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.clientInventario.send({ cmd: 'calcular_rendimiento' }, { producto_id: id, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }

    @Post('productos/:id/fabricar')
    fabricarProducto(@Param('id', ParseUUIDPipe) id: string, @Body() data: any, @Req() req: any) {
        return this.clientInventario.send({ cmd: 'fabricar_producto' }, { producto_id: id, ...data, id_empresa: req.user.empresaId })
            .pipe(catchError(err => { throw new RpcException(err) }));
    }
}