import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  nombre_legal: string; 

  @IsString()
  @IsOptional()
  nombre_comercial?: string;

  @IsString()
  @IsNotEmpty()
  nif_cif: string;
}