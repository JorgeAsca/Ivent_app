import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlmacenesService } from './almacenes.service';
import { CreateAlmacenDto } from './dto/create-almacen.dto';

@Controller()
export class AlmacenesController {
    constructor(private readonly service: AlmacenesService) { }

    @MessagePattern({ cmd: 'create_almacen' })
    create(@Payload() dto: CreateAlmacenDto) {
        return this.service.create(dto);
    }

    @MessagePattern({ cmd: 'find_all_almacenes' })
    findAll(@Payload() id_empresa: string) {
        return this.service.findAll(id_empresa);
    }

    @MessagePattern({ cmd: 'find_one_almacen' })
    findOne(@Payload() id: string) {
        return this.service.findOne(id);
    }

    @MessagePattern({ cmd: 'update_almacen' })
    update(@Payload() payload: { id: string, updateData: Partial<CreateAlmacenDto> }) {
        return this.service.update(payload.id, payload.updateData);
    }

    @MessagePattern({ cmd: 'delete_almacen' })
    remove(@Payload() id: string) {
        return this.service.remove(id);
    }
}