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

    async findOne(id: string, id_empresa: string) {
        return await this.proveedorRepository.findOne({ where: { id, id_empresa } });
    }

    async update(id: string, id_empresa: string, updateData: any) {
        try {
            await this.proveedorRepository.update({ id, id_empresa }, updateData);
            return this.findOne(id, id_empresa);
        } catch (error) {
            this.logger.error(`Error al actualizar proveedor: ${error.message}`);
            throw error;
        }
    }

    async remove(id: string, id_empresa: string) {
        try {
            await this.proveedorRepository.update({ id, id_empresa }, { activo: false });
            return { message: 'Proveedor desactivado correctamente' };
        } catch (error) {
            this.logger.error(`Error al desactivar proveedor: ${error.message}`);
            throw error;
        }
    }
}