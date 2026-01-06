import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConfiguracionGlobalService } from './configuracion-global.service';
import { CreateConfiguracionGlobalDto } from './dto/create-configuracion-global.dto';

@Controller()
export class ConfiguracionGlobalController {
    constructor(private readonly globalService: ConfiguracionGlobalService) { }

    @MessagePattern({ cmd: 'create_global_config' })
    create(@Payload() dto: CreateConfiguracionGlobalDto) {
        return this.globalService.create(dto);
    }

    @MessagePattern({ cmd: 'get_all_global_configs' })
    findAll() {
        return this.globalService.findAll();
    }

    @MessagePattern({ cmd: 'get_global_config_by_clave' })
    findByClave(@Payload() clave: string) {
        return this.globalService.findByClave(clave);
    }
}