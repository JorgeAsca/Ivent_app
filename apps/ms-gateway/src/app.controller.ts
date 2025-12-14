import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('health')
  healthCheck() {
    return 'Gateway is running';
  }
}