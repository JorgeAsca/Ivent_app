import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock } from './entities/stock.entity';
import { NatsModule } from '@app/common/transport/nats/nats.module';

@Module({
    imports: [TypeOrmModule.forFeature([Stock]), NatsModule],
    controllers: [StockController],
    providers: [StockService],
    exports: [StockService], 
})
export class StockModule { }