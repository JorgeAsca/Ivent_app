import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionGlobal } from './entities/configuracion-global.entity';
import { ConfiguracionGlobalService } from './configuracion-global.service';
import { ConfiguracionGlobalController } from './configuracion-global.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ConfiguracionGlobal])],
    controllers: [ConfiguracionGlobalController],
    providers: [ConfiguracionGlobalService],
})
export class ConfiguracionGlobalModule { }