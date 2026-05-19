import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('usuarios')
export class UsuariosController {
    // CAMBIA ESTO: De 'MS_USUARIOS_SERVICE' a 'NATS_SERVICE'
    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }

    @Post()
    crearUsuario(@Body() data: any) {
        // Usa natsClient
        return this.natsClient.send({ cmd: 'crear_usuario' }, data);
    }

    @Post('roles')
    crearRol(@Body() data: any) {
        return this.natsClient.send({ cmd: 'crear_rol' }, data);
    }

    @Post('roles/asignar-permiso')
    asignarPermiso(@Body() data: { id_rol: string, id_permiso: string }) {
        return this.natsClient.send({ cmd: 'asignar_permiso_a_rol' }, data);
    }
}