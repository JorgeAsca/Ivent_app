import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContactosService } from './contactos.service';
import { CreateContactoDto } from './dto/create-contacto.dto';

@Controller()
export class ContactosController {
    constructor(private readonly contactosService: ContactosService) { }

    @MessagePattern({ cmd: 'create_contacto' })
    create(@Payload() createContactoDto: CreateContactoDto) {
        return this.contactosService.create(createContactoDto);
    }

    @MessagePattern({ cmd: 'find_contactos_by_entidad' })
    findByEntidad(@Payload() data: { entidad_id: string; tipo_entidad: string }) {
        return this.contactosService.findByEntidad(data.entidad_id, data.tipo_entidad);
    }
}