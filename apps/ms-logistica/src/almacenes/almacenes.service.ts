import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Almacen } from './entities/almacen.entity';
import { CreateAlmacenDto } from './dto/create-almacen.dto';

@Injectable()
export class AlmacenesService {
    private readonly logger = new Logger(AlmacenesService.name);

    constructor(
        @InjectRepository(Almacen)
        private readonly repository: Repository<Almacen>,
    ) { }

    async create(dto: CreateAlmacenDto) {
        const nuevo = this.repository.create(dto);
        return await this.repository.save(nuevo);
    }

    async findAll(id_empresa: string) {
        return await this.repository.find({
            where: { id_empresa, estado: 'activo' },
        });
    }

    async findOne(id: string, id_empresa: string) {
        return await this.repository.findOne({ where: { id, id_empresa, estado: 'activo' } });
    }

    async update(id: string, id_empresa: string, updateData: Partial<CreateAlmacenDto>) {
        await this.repository.update({ id, id_empresa }, updateData);
        return this.findOne(id, id_empresa);
    }

    async remove(id: string, id_empresa: string) {
        return await this.repository.update({ id, id_empresa }, { estado: 'inactivo' });
    }
}