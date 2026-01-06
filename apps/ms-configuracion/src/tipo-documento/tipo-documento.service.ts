import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocumento } from './entities/tipo-documento.entity';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';

@Injectable()
export class TipoDocumentoService {
    private readonly logger = new Logger(TipoDocumentoService.name);

    constructor(
        @InjectRepository(TipoDocumento)
        private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
    ) { }

    async create(createTipoDocumentoDto: CreateTipoDocumentoDto) {
        try {
            const nuevo = this.tipoDocumentoRepository.create(createTipoDocumentoDto);
            return await this.tipoDocumentoRepository.save(nuevo);
        } catch (error) {
            this.logger.error(`Error al crear tipo de documento: ${error.message}`);
            throw error;
        }
    }

    async findAll() {
        return await this.tipoDocumentoRepository.find();
    }

    async findOne(id: number) {
        return await this.tipoDocumentoRepository.findOneBy({ id });
    }
}