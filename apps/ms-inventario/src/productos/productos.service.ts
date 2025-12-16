import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

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
            relations: ['categoria'],
        });
    }
    

    async findOne(id: string) {
        const producto = await this.productoRepository.findOne({
            where: { id, activo: true },
            relations: ['categoria']
        });
        if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return producto;
    }

    async update(id: string, updateProductoDto: UpdateProductoDto) {
        const producto = await this.findOne(id); // Validar que existe
        
        // Si quieren cambiar la categoría, verificamos que la nueva exista
        if (updateProductoDto.categoriaId) {
            const nuevaCategoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId });
            if (!nuevaCategoria) throw new NotFoundException(`Nueva categoría con ID ${updateProductoDto.categoriaId} no encontrada`);
            producto.categoria = nuevaCategoria;
        }

        const { categoriaId, ...datos } = updateProductoDto; // Sacamos categoriaId para que no choque con el objeto
        const productoActualizado = this.productoRepository.merge(producto, datos);
        
        return this.productoRepository.save(productoActualizado);
    }

    async remove(id: string) {
        const producto = await this.findOne(id);
        producto.activo = false; 
        return this.productoRepository.save(producto);
    }
}
