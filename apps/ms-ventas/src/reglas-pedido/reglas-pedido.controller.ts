import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReglasPedidoService } from './reglas-pedido.service';

@Controller()
export class ReglasPedidoController {
    constructor(private readonly reglasPedidoService: ReglasPedidoService) { }

    @MessagePattern({ cmd: 'ejecutar_reabastecimiento' })
    ejecutar(@Payload() id_empresa: string) {
        return this.reglasPedidoService.verificarYProcesar(id_empresa);
    }
}