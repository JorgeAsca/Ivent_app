import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedoresService {
    private readonly logger = new Logger(ProveedoresService.name);

    constructor(
        @InjectRepository(Proveedor)
        private readonly proveedorRepository: Repository<Proveedor>,
    ) { }

    async create(createProveedorDto: CreateProveedorDto) {
        try {
            const nuevo = this.proveedorRepository.create(createProveedorDto);
            return await this.proveedorRepository.save(nuevo);
        } catch (error) {
            this.logger.error(`Error al crear proveedor: ${error.message}`);
            throw error;
        }
    }

    async findAll(id_empresa: string) {
        return await this.proveedorRepository.find({
            where: { id_empresa, activo: true },
        });
    }

    async findOne(id: string) {
        return await this.proveedorRepository.findOneBy({ id });
    }
}