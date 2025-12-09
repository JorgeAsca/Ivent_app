import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { PrismaModule } from './prisma/prisma.module';
import { EmpresasModule } from './empresas/empresas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PermisosModule } from './permisos/permisos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/ms-administracion/.env', '.env'], 
    }),
    PrismaModule,   
    EmpresasModule, 
    UsuariosModule,
    PermisosModule,
  ],
  controllers: [], 
  providers: [],   
})
export class AdministracionModule {}
export { AdministracionModule as AppModule };