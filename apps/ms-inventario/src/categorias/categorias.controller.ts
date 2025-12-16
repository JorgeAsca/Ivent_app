import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { INVENTARIO_PATTERNS } from '@app/common';

@Controller()
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    @MessagePattern(INVENTARIO_PATTERNS.CREAR_CATEGORIA)
    create(@Payload() createCategoriaDto: CreateCategoriaDto) {
        return this.categoriasService.create(createCategoriaDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.LISTAR_CATEGORIAS)
    findAll() {
        return this.categoriasService.findAll();
    }


    @MessagePattern(INVENTARIO_PATTERNS.BUSCAR_CATEGORIA)
    findOne(@Payload() id: string) {
        return this.categoriasService.findOne(id);
    }

    @MessagePattern(INVENTARIO_PATTERNS.ACTUALIZAR_CATEGORIA)
    update(@Payload() updateCategoriaDto: UpdateCategoriaDto) {
        return this.categoriasService.update(updateCategoriaDto.id, updateCategoriaDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.ELIMINAR_CATEGORIA)
    remove(@Payload() id: string) {
        return this.categoriasService.remove(id);
    }
}