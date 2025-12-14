import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty()
    public nombre: string;

    @IsString()
    @IsOptional()
    public descripcion?: string;
}