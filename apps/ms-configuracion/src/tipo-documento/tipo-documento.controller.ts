import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TipoDocumentoService } from './tipo-documento.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';

@Controller()
export class TipoDocumentoController {
    constructor(private readonly tipoDocumentoService: TipoDocumentoService) { }

    @MessagePattern({ cmd: 'create_tipo_documento' })
    create(@Payload() createTipoDocumentoDto: CreateTipoDocumentoDto) {
        return this.tipoDocumentoService.create(createTipoDocumentoDto);
    }

    @MessagePattern({ cmd: 'find_all_tipos_documento' })
    findAll() {
        return this.tipoDocumentoService.findAll();
    }
}