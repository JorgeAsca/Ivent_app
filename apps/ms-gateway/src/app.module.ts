import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AdministracionModule } from './modulos/ms-administracion/ms-administracion.module';
import { InventarioModule } from './modulos/ms-inventario/ms-inventario.module';
import { MsUsuariosModule } from './modulos/ms-usuarios/ms-usuarios.module';
import { MsAnalyticsModule } from './modulos/ms-analytics/ms-analytics.module';
import { MsConfiguracionModule } from './modulos/ms-configuracion/ms-configuracion.module';
import { MsLogisticaModule } from './modulos/ms-logistica/ms-logistica.module';
import { MsTercerosModule } from './modulos/ms-terceros/ms-terceros.module';
import { MsVentasModule } from './modulos/ms-ventas/ms-ventas.module';
import { AuthModule } from './modulos/auth/auth.module';

import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key-iventapp',
      signOptions: { expiresIn: '1d' },
    }),
    AdministracionModule,
    InventarioModule,
    MsUsuariosModule,
    MsAnalyticsModule,
    MsConfiguracionModule,
    MsLogisticaModule,
    MsTercerosModule,
    MsVentasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}