import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AdministracionModule {}

// Alias para compatibilidad con tests
export { AdministracionModule as AppModule };
