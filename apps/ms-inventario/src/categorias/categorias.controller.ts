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
    create(@Payload() createCategoriaDto: any) {
        return this.categoriasService.create(createCategoriaDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.LISTAR_CATEGORIAS)
    findAll(@Payload() payload: { id_empresa: string }) {
        return this.categoriasService.findAll(payload.id_empresa);
    }


    @MessagePattern(INVENTARIO_PATTERNS.BUSCAR_CATEGORIA)
    findOne(@Payload() payload: { id: string, id_empresa: string }) {
        return this.categoriasService.findOne(payload.id, payload.id_empresa);
    }

    @MessagePattern(INVENTARIO_PATTERNS.ACTUALIZAR_CATEGORIA)
    update(@Payload() updateCategoriaDto: any) {
        return this.categoriasService.update(updateCategoriaDto.id, updateCategoriaDto.id_empresa, updateCategoriaDto);
    }

    @MessagePattern(INVENTARIO_PATTERNS.ELIMINAR_CATEGORIA)
    remove(@Payload() payload: { id: string, id_empresa: string }) {
        return this.categoriasService.remove(payload.id, payload.id_empresa);
    }
}