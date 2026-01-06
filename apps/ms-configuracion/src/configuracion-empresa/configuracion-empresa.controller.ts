import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';
import { CreateConfiguracionEmpresaDto } from './dto/create-configuracion-empresa.dto';

@Controller()
export class ConfiguracionEmpresaController {
    constructor(private readonly service: ConfiguracionEmpresaService) { }

    @MessagePattern({ cmd: 'save_empresa_config' })
    save(@Payload() dto: CreateConfiguracionEmpresaDto) {
        return this.service.createOrUpdate(dto);
    }

    @MessagePattern({ cmd: 'get_empresa_config' })
    findOne(@Payload() id_empresa: string) {
        return this.service.findByEmpresa(id_empresa);
    }
}