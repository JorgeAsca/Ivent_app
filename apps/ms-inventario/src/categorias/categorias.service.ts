import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
    private readonly logger = new Logger('CategoriasService');

    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) { }

    async create(createCategoriaDto: CreateCategoriaDto) {
        try {
            const categoria = this.categoriaRepository.create(createCategoriaDto);
            await this.categoriaRepository.save(categoria);
            return categoria;
        } catch (error) {
            this.logger.error(error);
            throw new Error('Error al crear categoría');
        }
    }

    findAll() {
        return this.categoriaRepository.find({ where: { activo: true } });
    }
}