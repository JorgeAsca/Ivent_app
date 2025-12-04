import { Controller, Get, Inject,Body, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs/internal/Observable';
import { ClientProxy } from '@nestjs/microservices';


@Controller('admin') // Prefijo para ordenar: localhost:3000/admin/rol
export class AppController {
  constructor(@Inject('ADMINISTRACION_SERVICE') private readonly client: ClientProxy) {}

  
  @Post('empresa')
  crearEmpresa(@Body() datos: any) {
    return this.client.send({ cmd: 'crear_empresa' }, datos);
  }

  // NUEVO: Endpoint para crear Rol
  @Post('rol')  
  crearRol(@Body() datos: any) {
    
    console.log('Gateway recibiendo rol:', datos);
    return this.client.send({ cmd: 'crear_rol' }, datos);
  }
}