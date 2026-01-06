import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
    constructor(@InjectRepository(Cliente) private readonly repo: Repository<Cliente>) { }

    create(dto: CreateClienteDto) {
        const nuevo = this.repo.create(dto);
        return this.repo.save(nuevo);
    }

    findAll(id_empresa: string) {
        return this.repo.find({ where: { id_empresa, activo: true } });
    }
}