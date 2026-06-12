import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { Public } from '../../decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) {}

  @Post('login')
  login(@Body() data: any) {
    return this.natsClient.send({ cmd: 'auth_login' }, data).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }

  @Post('registro')
  registro(@Body() data: any) {
    return this.natsClient.send({ cmd: 'auth_registro' }, data).pipe(
      catchError((error) => { throw new RpcException(error); })
    );
  }
}
