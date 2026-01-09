import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RendimientoMetrica } from './entities/rendimiento-metrica.entity';
import { RendimientoService } from './rendimiento.service';
import { RendimientoController } from './rendimiento.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RendimientoMetrica])],
    controllers: [RendimientoController],
    providers: [RendimientoService],
})
export class RendimientoModule { }