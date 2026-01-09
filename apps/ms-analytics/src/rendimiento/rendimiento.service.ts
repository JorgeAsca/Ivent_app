import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RendimientoMetrica } from './entities/rendimiento-metrica.entity';
import { CreateRendimientoDto } from './dto/create-rendimiento.dto';

@Injectable()
export class RendimientoService {
    constructor(
        @InjectRepository(RendimientoMetrica)
        private readonly repo: Repository<RendimientoMetrica>,
    ) { }

    async registrarMetrica(dto: CreateRendimientoDto) {
        const metrica = this.repo.create(dto);
        return await this.repo.save(metrica);
    }
}