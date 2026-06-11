import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Controller()
export class ProveedoresController {
    constructor(private readonly proveedoresService: ProveedoresService) { }

    @MessagePattern({ cmd: 'create_proveedor' })
    create(@Payload() createProveedorDto: CreateProveedorDto) {
        return this.proveedoresService.create(createProveedorDto);
    }

    @MessagePattern({ cmd: 'find_all_proveedores' })
    findAll(@Payload() id_empresa: string) {
        return this.proveedoresService.findAll(id_empresa);
    }

    @MessagePattern({ cmd: 'update_proveedor' })
    update(@Payload() payload: { id: string, data: any }) {
        return this.proveedoresService.update(payload.id, payload.data);
    }

    @MessagePattern({ cmd: 'remove_proveedor' })
    remove(@Payload() id: string) {
        return this.proveedoresService.remove(id);
    }
}