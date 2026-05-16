import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity'; 
import { NatsModule } from '@app/common/transport/nats/nats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria]),NatsModule,],
  
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}