import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

// Importación de Módulos internos
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';

// Entidades para la conexión global
import { User } from './usuarios/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Permission } from './permisos/entities/permission.entity';

@Module({
  imports: [
    // Cargamos variables de entorno (.env)
    ConfigModule.forRoot({ isGlobal: true }),

    // Configuración de Base de Datos Independiente
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Role, Permission],
      autoLoadEntities: true,
      synchronize: true, // Crea tablas automáticamente en la VPS
      logging: true,
    }),

    // Registro del cliente para hablar con ms-administracion
    ClientsModule.register([
      {
        name: 'MS_ADMIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MS_ADMIN_HOST || 'ms-administracion',
          port: 3000,
        },
      },
    ]),

    // Módulos de Dominio
    UsuariosModule,
    RolesModule,
    PermisosModule,
  ],
})
export class AppModule {}