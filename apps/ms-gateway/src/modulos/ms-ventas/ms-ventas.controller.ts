import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ventas')
export class VentasController {
    constructor(@Inject('MS__SERVICE') private client: ClientProxy) { }

    @Get()
    ping() {
        return this.client.send({ cmd: 'ping_ventas' }, {});
    }
}