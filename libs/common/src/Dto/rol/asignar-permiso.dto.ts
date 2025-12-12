import { IsNotEmpty, IsUUID } from 'class-validator';

export class AsignarPermisoRolDto {
  @IsUUID()
  @IsNotEmpty()
  rolId: string;

  @IsUUID()
  @IsNotEmpty()
  permisoId: string;
}