import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsUUID()
  @IsNotEmpty()
  empresaId: string;
}