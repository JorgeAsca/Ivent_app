import { IsString, IsNumber, IsPositive, IsUUID, IsOptional } from 'class-validator';

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

  @IsString()
  @IsOptional()
  ticket_id?: string;
}