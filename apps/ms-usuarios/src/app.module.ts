import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { envs } from './config/envs';

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
      url: envs.databaseUrl,
      entities: [User, Role, Permission],
      autoLoadEntities: true,
      synchronize: true, // Crea tablas automáticamente en la VPS
      logging: true,
    }),

    // Módulos de Dominio
    UsuariosModule,
    RolesModule,
    PermisosModule,
  ],
})
export class AppModule {}