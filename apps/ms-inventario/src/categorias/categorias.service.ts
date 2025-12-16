import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

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
            throw new Error('Error al crear categoría (Posible nombre duplicado)');
        }
    }

    findAll() {
        return this.categoriaRepository.find({ where: { activo: true } });
    }



    async findOne(id: string) {
        const categoria = await this.categoriaRepository.findOne({ 
            where: { id, activo: true },
            relations: ['productos'] 
        });
        if (!categoria) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        return categoria;
    }

    async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
        const categoria = await this.findOne(id); 
        
        // Merge actualiza los campos que vengan en el DTO sobre la entidad existente
        const categoriaActualizada = this.categoriaRepository.merge(categoria, updateCategoriaDto);
        return this.categoriaRepository.save(categoriaActualizada);
    }

    async remove(id: string) {
        const categoria = await this.findOne(id);
        // Soft Delete (Cambiar estado a inactivo)
        categoria.activo = false;
        return this.categoriaRepository.save(categoria);
        
    }
}