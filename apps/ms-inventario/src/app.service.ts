import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Hola desde ms-inventario! El pipeline GitOps';
  }
}
