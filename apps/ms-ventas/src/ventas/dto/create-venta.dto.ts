import { IsString, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateVentaDto {
  @IsUUID()
  clienteId: string;

  @IsString()
  productoId: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  total: number;
}