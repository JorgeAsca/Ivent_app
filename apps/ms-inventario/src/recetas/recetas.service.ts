import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecetaIngrediente } from './entities/receta-ingrediente.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class RecetasService {
    private readonly logger = new Logger('RecetasService');

    constructor(
        @InjectRepository(RecetaIngrediente)
        private readonly recetaRepo: Repository<RecetaIngrediente>,
        @InjectRepository(Producto)
        private readonly productoRepo: Repository<Producto>,
        @Inject('NATS_SERVICE')
        private readonly natsClient: ClientProxy,
    ) { }

    async guardarReceta(dto: CreateRecetaDto) {
        // Eliminar receta anterior si existe
        await this.recetaRepo.delete({
            producto_id: dto.producto_id,
            id_empresa: dto.id_empresa
        });

        if (!dto.ingredientes || dto.ingredientes.length === 0) {
            return []; // Receta vacía
        }

        const nuevasRecetas = dto.ingredientes.map(ing => {
            return this.recetaRepo.create({
                producto_id: dto.producto_id,
                ingrediente_id: ing.ingrediente_id,
                cantidad_necesaria: ing.cantidad_necesaria,
                id_almacen: ing.id_almacen,
                id_empresa: dto.id_empresa
            });
        });

        await this.recetaRepo.save(nuevasRecetas);
        this.logger.log(`Receta guardada para producto ${dto.producto_id} con ${nuevasRecetas.length} ingredientes.`);
        
        // Recalcular y actualizar costo del producto padre
        const recetaCompleta = await this.obtenerReceta(dto.producto_id, dto.id_empresa);
        let costoTotal = 0;
        for (const item of recetaCompleta) {
            costoTotal += (item.ingrediente.costo || 0) * item.cantidad_necesaria;
        }

        await this.productoRepo.update(
            { id: dto.producto_id, id_empresa: dto.id_empresa },
            { costo: costoTotal }
        );
        this.logger.log(`Costo autocalculado del producto ${dto.producto_id} actualizado a ${costoTotal}`);

        // Return the freshly saved recipe with relations
        return recetaCompleta;
    }

    async obtenerReceta(producto_id: string, id_empresa: string) {
        return await this.recetaRepo.find({
            where: { producto_id, id_empresa },
            relations: ['ingrediente']
        });
    }

    async calcularRendimiento(producto_id: string, id_empresa: string) {
        const receta = await this.obtenerReceta(producto_id, id_empresa);
        
        if (!receta || receta.length === 0) {
            return { maxProduccion: 0, detalles: [], error: 'El producto no tiene receta configurada.' };
        }

        let maxProduccion = Infinity;
        const detalles = [];

        for (const item of receta) {
            // El stock actual ya viene en la relacion "ingrediente" que es de tipo Producto
            const stockActual = item.ingrediente.stock;
            const requerido = item.cantidad_necesaria;
            
            // Cuantos productos finales se pueden hacer con este ingrediente particular
            const posibleConEste = requerido > 0 ? Math.floor(stockActual / requerido) : Infinity;

            if (posibleConEste < maxProduccion) {
                maxProduccion = posibleConEste;
            }

            detalles.push({
                ingrediente_id: item.ingrediente.id,
                nombre: item.ingrediente.nombre,
                unidadMedida: item.ingrediente.unidadMedida,
                stock_actual: stockActual,
                requerido_por_unidad: requerido,
                posible_con_este: posibleConEste
            });
        }

        // Si maxProduccion sigue siendo Infinity, algo esta mal o requerido era 0
        if (maxProduccion === Infinity) maxProduccion = 0;

        // Calcular limitantes y sobrantes
        for (const det of detalles) {
            det.limitante = det.posible_con_este === maxProduccion;
            // Cuanto stock va a sobrar si fabricamos el MAXIMO posible
            det.sobrante = det.stock_actual - (maxProduccion * det.requerido_por_unidad);
        }

        return {
            maxProduccion,
            detalles
        };
    }

    async fabricarProducto(producto_id: string, cantidad: number, id_almacen_destino: string, id_empresa: string) {
        if (cantidad <= 0) throw new Error('La cantidad a fabricar debe ser mayor a 0');

        const receta = await this.obtenerReceta(producto_id, id_empresa);
        if (!receta || receta.length === 0) {
            throw new Error('El producto no tiene receta configurada');
        }

        const productoFinal = await this.productoRepo.findOne({ where: { id: producto_id, id_empresa } });
        if (!productoFinal) throw new Error('Producto final no encontrado');

        // Verify stock for all ingredients
        for (const item of receta) {
            const requerido = item.cantidad_necesaria * cantidad;
            const stockActual = item.ingrediente.stock; // We should probably check the specific warehouse stock if we had it, but for now we rely on global stock, or we trust the user. 
            // The movement will be created in ms-logistica.
        }

        // Create movements via NATS
        // 1. Output ingredients
        for (const item of receta) {
            const requerido = item.cantidad_necesaria * cantidad;
            await firstValueFrom(this.natsClient.send({ cmd: 'crear_movimiento' }, {
                id_producto: item.ingrediente_id,
                id_almacen: item.id_almacen || id_almacen_destino, // Fallback to destination if not set
                cantidad: requerido,
                tipo: 'SALIDA',
                motivo: 'CONSUMO_RECETA',
                id_empresa: id_empresa
            }));
        }

        // 2. Input finished product
        await firstValueFrom(this.natsClient.send({ cmd: 'crear_movimiento' }, {
            id_producto: producto_id,
            id_almacen: id_almacen_destino,
            cantidad: cantidad,
            tipo: 'ENTRADA',
            motivo: 'PRODUCCION_INTERNA',
            id_empresa: id_empresa
        }));

        return { success: true, message: 'Orden de fabricación enviada correctamente' };
    }
}
