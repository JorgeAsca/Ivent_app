import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('crear_empresa') 
  async createEmpresa(@Payload() data: any) {
    console.log('Microservicio recibiendo data:', data); 
    return this.appService.createEmpresa(data);
  }

  @MessagePattern('crear_usuario')
  async createUsuario(@Payload() data: any) {
    return this.appService.createEmpresa(data);
  }
}
