import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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
        const { categoriaId, almacenId, ...datosProducto } = createProductoDto;

        if (!datosProducto.sku || datosProducto.sku.trim() === '') {
            const prefix = datosProducto.nombre ? datosProducto.nombre.substring(0, 3).toUpperCase().padEnd(3, 'X') : 'PRD';
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            datosProducto.sku = `${prefix}-${randomNum}`;
        }

        const categoria = await this.categoriaRepository.findOneBy({ id: categoriaId });
        if (!categoria) {
            throw new NotFoundException(`Categoría con ID ${categoriaId} no encontrada`);
        }

        let almacen: any = null;
        if (almacenId) {
            almacen = await firstValueFrom(this.natsClient.send({ cmd: 'find_one_almacen' }, almacenId)).catch(() => null);
            if (!almacen) {
                throw new NotFoundException(`Almacén con ID ${almacenId} no encontrado en logística`);
            }
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
                almacenId: almacenId || null
            });

            // Registrar movimiento inicial si hay stock
            if (productoGuardado.stock > 0 && almacen) {
                this.natsClient.send({ cmd: 'crear_movimiento' }, {
                    id_producto: productoGuardado.id,
                    id_almacen: almacen.id,
                    id_empresa: almacen.id_empresa,
                    tipo: 'ENTRADA',
                    cantidad: productoGuardado.stock,
                    referencia_externa: 'CREACION_INICIAL'
                }).subscribe({
                    error: (err) => this.logger.error('Error al registrar movimiento inicial', err)
                });
            }

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
        const stockAnterior = producto.stock;

        if (updateProductoDto.categoriaId) {
            const nuevaCategoria = await this.categoriaRepository.findOneBy({ id: updateProductoDto.categoriaId });
            if (!nuevaCategoria) throw new NotFoundException(`Nueva categoría con ID ${updateProductoDto.categoriaId} no encontrada`);
            producto.categoria = nuevaCategoria;
        }

        const { categoriaId, ...datos } = updateProductoDto;
        // Evitamos que se pueda actualizar el stock directamente desde aquí
        if ('stock' in datos) {
            delete (datos as any).stock;
        }
        if ('almacenId' in datos) {
            delete (datos as any).almacenId;
        }
        const productoActualizado = this.productoRepository.merge(producto, datos);
        const productoGuardado = await this.productoRepository.save(productoActualizado);

        return productoGuardado;
    }

    async remove(id: string) {
        const producto = await this.findOne(id);
        producto.activo = false;
        return this.productoRepository.save(producto);
    }

    async actualizarStockReal(id: string, stock_actual: number) {
        try {
            const producto = await this.findOne(id);
            if (producto.stock !== stock_actual) {
                const stockAnterior = producto.stock;
                producto.stock = stock_actual;
                await this.productoRepository.save(producto);
                this.logger.log(`Stock actualizado sincronizado para ${id}: nuevo stock = ${stock_actual}`);

                // Si el stock cruzó el límite hacia abajo, enviar alerta
                const stockMinimo = producto.stockMinimo || 0;
                if (stockAnterior > stockMinimo && stock_actual <= stockMinimo) {
                    this.natsClient.emit('alerta_stock_bajo', {
                        productoId: producto.id,
                        nombre: producto.nombre,
                        stock_actual: stock_actual,
                        stock_minimo: stockMinimo,
                        proveedorId: producto.proveedorId || null,
                        unidadMedida: producto.unidadMedida || 'Ud'
                    });
                    this.logger.log(`Alerta de stock bajo emitida para producto ${id}`);
                }
            }
        } catch (error) {
            this.logger.warn(`No se pudo sincronizar stock del producto ${id}: ${error.message}`);
        }
    }
}
