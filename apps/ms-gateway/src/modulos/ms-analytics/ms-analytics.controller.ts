import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('analytics')
export class MsAnalyticsController {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    try {
      const inventarioStats = await this.natsClient.send({ cmd: 'get_dashboard_stats' }, {}).toPromise();
      const logisticaStats = await this.natsClient.send({ cmd: 'get_dashboard_stats_logistica' }, {}).toPromise();

      return {
        ...inventarioStats,
        ...logisticaStats,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}