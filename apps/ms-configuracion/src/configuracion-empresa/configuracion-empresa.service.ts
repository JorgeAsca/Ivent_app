import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionEmpresa } from './entities/configuracion-empresa.entity';
import { CreateConfiguracionEmpresaDto } from './dto/create-configuracion-empresa.dto';

@Injectable()
export class ConfiguracionEmpresaService {
    private readonly logger = new Logger(ConfiguracionEmpresaService.name);

    constructor(
        @InjectRepository(ConfiguracionEmpresa)
        private readonly repo: Repository<ConfiguracionEmpresa>,
    ) { }

    async createOrUpdate(dto: CreateConfiguracionEmpresaDto) {
        const existe = await this.repo.findOneBy({ id_empresa: dto.id_empresa });

        if (existe) {
            this.repo.merge(existe, dto);
            return await this.repo.save(existe);
        }

        const nuevaConfig = this.repo.create(dto);
        return await this.repo.save(nuevaConfig);
    }

    async findByEmpresa(id_empresa: string) {
        return await this.repo.findOneBy({ id_empresa });
    }
}