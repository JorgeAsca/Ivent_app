import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacto } from './entities/contacto.entity';
import { CreateContactoDto } from './dto/create-contacto.dto';

@Injectable()
export class ContactosService {
    constructor(
        @InjectRepository(Contacto)
        private readonly contactoRepository: Repository<Contacto>,
    ) { }

    async create(createContactoDto: CreateContactoDto) {
        const nuevoContacto = this.contactoRepository.create(createContactoDto);
        return await this.contactoRepository.save(nuevoContacto);
    }

    async findByEntidad(entidad_id: string, tipo_entidad: string) {
        return await this.contactoRepository.find({
            where: { entidad_id, tipo_entidad },
        });
    }

    async update(id: string, updateData: Partial<CreateContactoDto>) {
        await this.contactoRepository.update(id, updateData);
        return this.contactoRepository.findOneBy({ id });
    }
}