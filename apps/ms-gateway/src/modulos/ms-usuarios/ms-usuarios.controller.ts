import { Controller, Post, Body, Get, Inject, Param, Patch, Delete, ParseUUIDPipe, Req } from '@nestjs/common';
import { RequirePermissions } from '../../decorators/permissions.decorator';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
@Controller('usuarios')
export class UsuariosController {
    // CAMBIA ESTO: De 'MS_USUARIOS_SERVICE' a 'NATS_SERVICE'
    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }

    @Post()
    @RequirePermissions('usuarios:crear')
    crearUsuario(@Body() data: any) {
        // Usa natsClient
        return this.natsClient.send({ cmd: 'crear_usuario' }, data).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Post('roles')
    @RequirePermissions('roles:crear')
    crearRol(@Req() req: any, @Body() data: any) {
        const empresaId = req.user?.empresaId;
        return this.natsClient.send({ cmd: 'crear_rol' }, { ...data, empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Post('roles/asignar-permiso')
    @RequirePermissions('roles:editar')
    asignarPermiso(@Body() data: { id_rol: string, id_permiso: string }) {
        return this.natsClient.send({ cmd: 'asignar_permiso_a_rol' }, data).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Get()
    obtenerUsuarios(@Req() req: any) {
        const empresaId = req.user?.empresaId;
        return this.natsClient.send({ cmd: 'listar_usuarios' }, { empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Get('roles')
    obtenerRoles(@Req() req: any) {
        const empresaId = req.user?.empresaId;
        return this.natsClient.send({ cmd: 'listar_roles' }, { empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Patch('roles/:id')
    @RequirePermissions('roles:editar')
    actualizarRol(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
        const empresaId = req.user?.empresaId;
        return this.natsClient.send({ cmd: 'actualizar_rol' }, { id, ...data, empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Delete('roles/:id')
    @RequirePermissions('roles:eliminar')
    eliminarRol(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
        const empresaId = req.user?.empresaId;
        return this.natsClient.send({ cmd: 'eliminar_rol' }, { id, empresaId }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Get('permisos')
    obtenerPermisos() {
        return this.natsClient.send({ cmd: 'listar_permisos' }, {}).pipe(
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
    @RequirePermissions('usuarios:editar')
    actualizarUsuario(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
        return this.natsClient.send({ cmd: 'actualizar_usuario' }, { id, ...data }).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }

    @Delete(':id')
    @RequirePermissions('usuarios:eliminar')
    eliminarUsuario(@Param('id', ParseUUIDPipe) id: string) {
        return this.natsClient.send({ cmd: 'eliminar_usuario' }, id).pipe(
            catchError((error) => { throw new RpcException(error); })
        );
    }


}