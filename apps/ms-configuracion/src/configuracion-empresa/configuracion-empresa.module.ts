import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionEmpresa } from './entities/configuracion-empresa.entity';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';
import { ConfiguracionEmpresaController } from './configuracion-empresa.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ConfiguracionEmpresa])],
    controllers: [ConfiguracionEmpresaController],
    providers: [ConfiguracionEmpresaService],
})
export class ConfiguracionEmpresaModule { }