import { Module } from '@nestjs/common';
import { NatsModule } from '@app/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';


@Module({
  imports: [NatsModule],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresasModule {}