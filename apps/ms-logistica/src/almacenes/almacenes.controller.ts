import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlmacenesService } from './almacenes.service';
import { CreateAlmacenDto } from './dto/create-almacen.dto';

@Controller()
export class AlmacenesController {
    constructor(private readonly service: AlmacenesService) { }

    @MessagePattern({ cmd: 'create_almacen' })
    create(@Payload() dto: any) {
        return this.service.create(dto);
    }

    @MessagePattern({ cmd: 'find_all_almacenes' })
    findAll(@Payload() payload: { id_empresa: string }) {
        return this.service.findAll(payload.id_empresa);
    }

    @MessagePattern({ cmd: 'find_one_almacen' })
    findOne(@Payload() payload: { id: string, id_empresa: string }) {
        return this.service.findOne(payload.id, payload.id_empresa);
    }

    @MessagePattern({ cmd: 'update_almacen' })
    update(@Payload() payload: { id: string, id_empresa: string, updateData: Partial<CreateAlmacenDto> }) {
        return this.service.update(payload.id, payload.id_empresa, payload.updateData);
    }

    @MessagePattern({ cmd: 'delete_almacen' })
    remove(@Payload() payload: { id: string, id_empresa: string }) {
        return this.service.remove(payload.id, payload.id_empresa);
    }
}