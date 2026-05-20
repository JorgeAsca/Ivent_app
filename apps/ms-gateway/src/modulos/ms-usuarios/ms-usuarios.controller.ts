import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
@Controller('usuarios')
export class UsuariosController {
    // CAMBIA ESTO: De 'MS_USUARIOS_SERVICE' a 'NATS_SERVICE'
    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }

    @Post()
    crearUsuario(@Body() data: any) {
        // Usa natsClient
        return this.natsClient.send({ cmd: 'crear_usuario' }, data).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Post('roles')
    crearRol(@Body() data: any) {
        return this.natsClient.send({ cmd: 'crear_rol' }, data).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Post('roles/asignar-permiso')
    asignarPermiso(@Body() data: { id_rol: string, id_permiso: string }) {
        return this.natsClient.send({ cmd: 'asignar_permiso_a_rol' }, data).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Get()
    obtenerUsuarios() {
        return this.natsClient.send({ cmd: 'listar_usuarios' }, {}).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Get(':id')
    obtenerUsuario(@Param('id', ParseUUIDPipe) id: string) {
        return this.natsClient.send({ cmd: 'buscar_usuario' }, id).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Patch(':id')
    actualizarUsuario(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
        return this.natsClient.send({ cmd: 'actualizar_usuario' }, { id, ...data }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Delete(':id')
    eliminarUsuario(@Param('id', ParseUUIDPipe) id: string) {
        return this.natsClient.send({ cmd: 'eliminar_usuario' }, id).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Get('roles')
    obtenerRoles() {
        return this.natsClient.send({ cmd: 'listar_roles' }, {}).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }
}