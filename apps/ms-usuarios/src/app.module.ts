import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './usuarios/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Permission } from './permisos/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db-usuarios',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'db_usuarios',
      entities: [User, Role, Permission],
      synchronize: true, // Auto-creación de tablas y relaciones intermedias
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
})
export class AppModule {}