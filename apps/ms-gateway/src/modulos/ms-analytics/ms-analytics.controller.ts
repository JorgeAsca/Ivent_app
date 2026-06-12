import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('analytics')
export class MsAnalyticsController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Get('dashboard')
  async getDashboardStats(@Req() req: any) {
    try {
      const inventarioStats = await this.natsClient.send({ cmd: 'get_dashboard_stats' }, { id_empresa: req.user.empresaId }).toPromise();
      const logisticaStats = await this.natsClient.send({ cmd: 'get_dashboard_stats_logistica' }, { id_empresa: req.user.empresaId }).toPromise();
      
      return {
        inventario: inventarioStats,
        logistica: logisticaStats,
        ventas: { totalVentas: 0, ultimasVentas: [] } 
      };
    } catch (error) {
      console.error('Error obteniendo stats del dashboard:', error);
      return { error: 'No se pudieron cargar las estadísticas' };
    }
  }
}