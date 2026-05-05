import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('terceros')
export class TercerosController {
    constructor(@Inject('MS__SERVICE') private client: ClientProxy) { }

    @Get()
    ping() {
        return this.client.send({ cmd: 'ping_terceros' }, {});
    }
}