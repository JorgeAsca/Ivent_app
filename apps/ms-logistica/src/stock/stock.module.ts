import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock } from './entities/stock.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Stock])],
    controllers: [StockController],
    providers: [StockService],
    exports: [StockService], // Importante exportarlo para que MovimientosService lo use
})
export class StockModule { }