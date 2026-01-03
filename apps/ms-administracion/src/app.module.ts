import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { PrismaModule } from './prisma/prisma.module';
import { EmpresasModule } from './empresas/empresas.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/ms-administracion/.env', '.env'], 
    }),
    PrismaModule,   
    EmpresasModule,
  ],
  controllers: [], 
  providers: [],   
})
export class AdministracionModule {}
export { AdministracionModule as AppModule };