import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermisoDto {
  @IsString()
  @IsNotEmpty()
  recurso: string; 

  @IsString()
  @IsNotEmpty()
  accion: string;
}