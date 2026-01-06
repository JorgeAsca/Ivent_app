import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocumentoService } from './tipo-documento.service';
import { TipoDocumentoController } from './tipo-documento.controller';
import { TipoDocumento } from './entities/tipo-documento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoDocumento]) // Registra la entidad para este módulo
  ],
  controllers: [TipoDocumentoController],
  providers: [TipoDocumentoService],
  exports: [TipoDocumentoService], // Por si otro módulo interno lo necesita
})
export class TipoDocumentoModule {}