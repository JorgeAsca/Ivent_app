import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller()
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @MessagePattern({ cmd: 'create_cliente' })
    create(@Payload() createClienteDto: CreateClienteDto) {
        return this.clientesService.create(createClienteDto);
    }

    @MessagePattern({ cmd: 'find_all_clientes' })
    findAll(@Payload() id_empresa: string) {
        return this.clientesService.findAll(id_empresa);
    }
}