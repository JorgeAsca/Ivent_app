import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { ContactosModule } from './contactos/contactos.module';
import { ReglasPedidoModule } from './reglas-pedido/reglas-pedido.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'db_ventas',
      autoLoadEntities: true,
      synchronize: true,
    }),
    // Registro del Barril de Datos
    ClientsModule.register([
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'ms-analytics', port: 3000 },
      },
    ]),
    ClientesModule,
    ProveedoresModule,
    DireccionesModule,
    ContactosModule,
    ReglasPedidoModule,
  ],
})
export class AppModule { }