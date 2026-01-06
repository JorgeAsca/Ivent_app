import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { ContactosModule } from './contactos/contactos.module';
import { ReglasPedidoModule } from './reglas-pedido/reglas-pedido.module';

@Module({
  imports: [
    // Configuración de DB omitida por brevedad...

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