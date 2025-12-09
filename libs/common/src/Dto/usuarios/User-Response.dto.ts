import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UserResponseDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}