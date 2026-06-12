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

    async create(createCategoriaDto: any) {
        try {
            const categoria = this.categoriaRepository.create(createCategoriaDto);
            await this.categoriaRepository.save(categoria);
            return categoria;
        } catch (error) {
            this.logger.error(error);
            throw new Error('Error al crear categoría (Posible nombre duplicado)');
        }
    }

    findAll(id_empresa: string) {
        return this.categoriaRepository.find({ where: { activo: true, id_empresa } });
    }



    async findOne(id: string, id_empresa: string) {
        const categoria = await this.categoriaRepository.findOne({ 
            where: { id, activo: true, id_empresa },
            relations: ['productos'] 
        });
        if (!categoria) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        return categoria;
    }

    async update(id: string, id_empresa: string, updateCategoriaDto: any) {
        const categoria = await this.findOne(id, id_empresa); 
        
        // Merge actualiza los campos que vengan en el DTO sobre la entidad existente
        const categoriaActualizada = this.categoriaRepository.merge(categoria, updateCategoriaDto);
        return this.categoriaRepository.save(categoriaActualizada);
    }

    async remove(id: string, id_empresa: string) {
        const categoria = await this.findOne(id, id_empresa);
        
        categoria.activo = false;
        return this.categoriaRepository.save(categoria);
        
    }
}