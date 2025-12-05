import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  createEmpresa(data: any) {
    throw new Error('Method not implemented.');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
