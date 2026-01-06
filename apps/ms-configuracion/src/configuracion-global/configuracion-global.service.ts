import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionGlobal } from './entities/configuracion-global.entity';
import { CreateConfiguracionGlobalDto } from './dto/create-configuracion-global.dto';

@Injectable()
export class ConfiguracionGlobalService {
    constructor(
        @InjectRepository(ConfiguracionGlobal)
        private readonly globalRepo: Repository<ConfiguracionGlobal>,
    ) { }

    async create(dto: CreateConfiguracionGlobalDto) {
        const nuevaConfig = this.globalRepo.create(dto);
        return await this.globalRepo.save(nuevaConfig);
    }

    async findAll() {
        return await this.globalRepo.find({ where: { activo: true } });
    }

    async findByClave(clave: string) {
        return await this.globalRepo.findOneBy({ clave });
    }
}