import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        // Registramos el cliente para que este módulo hable con ms-administracion
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
    ],
    controllers: [UsuariosController],
    providers: [UsuariosService],
})
export class UsuariosModule { }