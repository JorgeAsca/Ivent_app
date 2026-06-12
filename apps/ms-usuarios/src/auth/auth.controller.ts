import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_login' })
  async login(@Payload() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: 'auth_registro' })
  async registro(@Payload() registroDto: any) {
    return this.authService.registro(registroDto);
  }
}
