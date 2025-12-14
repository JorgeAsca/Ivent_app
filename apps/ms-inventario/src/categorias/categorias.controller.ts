import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Controller()
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    // Estos strings deberían ir en un archivo de constantes compartido (libs/common)
    @MessagePattern('crear_categoria')
    create(@Payload() createCategoriaDto: CreateCategoriaDto) {
        return this.categoriasService.create(createCategoriaDto);
    }

    @MessagePattern('listar_categorias')
    findAll() {
        return this.categoriasService.findAll();
    }
}