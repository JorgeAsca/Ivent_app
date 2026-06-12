import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Controller()
export class ProveedoresController {
    constructor(private readonly proveedoresService: ProveedoresService) { }

    @MessagePattern({ cmd: 'create_proveedor' })
    create(@Payload() createProveedorDto: any) {
        return this.proveedoresService.create(createProveedorDto);
    }

    @MessagePattern({ cmd: 'find_all_proveedores' })
    findAll(@Payload() payload: { id_empresa: string }) {
        return this.proveedoresService.findAll(payload.id_empresa);
    }

    @MessagePattern({ cmd: 'find_one_proveedor' })
    findOne(@Payload() payload: { id: string, id_empresa: string }) {
        return this.proveedoresService.findOne(payload.id, payload.id_empresa);
    }

    @MessagePattern({ cmd: 'update_proveedor' })
    update(@Payload() payload: { id: string, id_empresa: string, data: any }) {
        return this.proveedoresService.update(payload.id, payload.id_empresa, payload.data);
    }

    @MessagePattern({ cmd: 'remove_proveedor' })
    remove(@Payload() payload: { id: string, id_empresa: string }) {
        return this.proveedoresService.remove(payload.id, payload.id_empresa);
    }
}