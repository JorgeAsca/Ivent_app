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
        if (!id_empresa) {
            return await this.repository.find();
        }
        return await this.repository.find({
            where: { id_empresa },
        });
    }

    async findOne(id: string) {
        return await this.repository.findOneBy({ id });
    }

    async update(id: string, updateData: Partial<CreateAlmacenDto>) {
        await this.repository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string) {
        return await this.repository.update(id, { estado: 'inactivo' });
    }
}