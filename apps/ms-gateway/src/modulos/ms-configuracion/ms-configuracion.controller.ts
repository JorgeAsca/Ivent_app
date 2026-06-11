import { Controller, Post, Body, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('configuracion')
export class ConfiguracionController {
    // CAMBIA ESTO: De 'MS__SERVICE' a 'NATS_SERVICE'
    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }

    @Get()
    ping() {
        return this.natsClient.send({ cmd: 'ping_configuracion' }, {});
    }

    @Get('global')
    getAllGlobal() {
        return this.natsClient.send({ cmd: 'get_all_global_configs' }, {});
    }

    @Post('global/upsert')
    upsertGlobal(@Body() dto: { clave: string; valor: string }) {
        return this.natsClient.send({ cmd: 'upsert_global_config' }, dto);
    }
}