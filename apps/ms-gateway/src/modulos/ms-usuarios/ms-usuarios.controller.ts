import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('usuarios')
export class UsuariosController {
    constructor(@Inject('MS_USUARIOS_SERVICE') private client: ClientProxy) { }

    @Post()
    crearUsuario(@Body() data: any) {
        return this.client.send({ cmd: 'crear_usuario' }, data);
    }

    @Post('roles')
    crearRol(@Body() data: any) {
        return this.client.send({ cmd: 'crear_rol' }, data);
    }

    @Post('roles/asignar-permiso')
    asignarPermiso(@Body() data: { id_rol: string, id_permiso: string }) {
        return this.client.send({ cmd: 'asignar_permiso_a_rol' }, data);
    }
}