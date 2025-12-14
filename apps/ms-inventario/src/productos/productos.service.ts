import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
    private readonly logger = new Logger('ProductosService');

    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) { }

    async create(createProductoDto: CreateProductoDto) {
        const { categoriaId, ...datosProducto } = createProductoDto;


        const categoria = await this.categoriaRepository.findOneBy({ id: categoriaId });
        if (!categoria) {
            throw new NotFoundException(`Categoría con ID ${categoriaId} no encontrada`);
        }

        try {
            const nuevoProducto = this.productoRepository.create({
                ...datosProducto,
                categoria: categoria,
            });

            await this.productoRepository.save(nuevoProducto);
            return nuevoProducto;

        } catch (error) {
            this.logger.error(error);
            throw new Error('Error al crear producto (posible SKU duplicado)');
        }
    }

    findAll() {
        return this.productoRepository.find({
            where: { activo: true },
        });
    }
}