import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Direccion } from './entities/direccion.entity';
import { CreateDireccionDto } from './dto/create-direccion.dto';

@Injectable()
export class DireccionesService {
    constructor(
        @InjectRepository(Direccion)
        private readonly direccionRepository: Repository<Direccion>,
    ) { }

    async create(createDireccionDto: CreateDireccionDto) {
        const nuevaDireccion = this.direccionRepository.create(createDireccionDto);
        return await this.direccionRepository.save(nuevaDireccion);
    }

    async findByEntidad(entidad_id: string, tipo_entidad: string) {
        return await this.direccionRepository.find({
            where: { entidad_id, tipo_entidad },
        });
    }

    async remove(id: string) {
        return await this.direccionRepository.delete(id);
    }
}