import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductosService {
    private readonly logger = new Logger('ProductosService');

    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
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

            const productoGuardado = await this.productoRepository.save(nuevoProducto);

            this.logger.log(`Producto creado en BD con ID: ${productoGuardado.id}`);
            this.natsClient.emit('producto_creado', {
                productoId: productoGuardado.id,
                nombre: productoGuardado.nombre,
            });

            return productoGuardado;

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
        const producto = await this.findOne(id);

        if (updateProductoDto.categoriaId) {
            const nuevaCategoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId });
            if (!nuevaCategoria) throw new NotFoundException(`Nueva categoría con ID ${updateProductoDto.categoriaId} no encontrada`);
            producto.categoria = nuevaCategoria;
        }

        const { categoriaId, ...datos } = updateProductoDto;
        const productoActualizado = this.productoRepository.merge(producto, datos);

        return this.productoRepository.save(productoActualizado);
    }

    async remove(id: string) {
        const producto = await this.findOne(id);
        producto.activo = false;
        return this.productoRepository.save(producto);
    }
}
