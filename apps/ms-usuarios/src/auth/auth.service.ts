import { Injectable, Inject } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RolesService } from '../roles/roles.service';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;
    const user = await this.usuariosService.findByEmail(email);

    if (!user) {
      throw new RpcException({ status: 401, message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({ status: 401, message: 'Credenciales inválidas' });
    }

    const payload = { 
      sub: user.id_usuario, 
      email: user.email, 
      empresaId: user.empresaId,
      rolId: user.rol?.id_rol,
      rolNombre: user.rol?.nombre,
      permisos: user.rol?.permisos?.map(p => p.nombre) || []
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id_usuario: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        empresaId: user.empresaId,
        rolId: user.rol?.id_rol,
        rol: user.rol ? {
          ...user.rol,
          permisos: user.rol.permisos?.map(p => p.nombre) || []
        } : null
      }
    };
  }

  async registro(registroDto: any) {
    // 1. Crear la Empresa en ms-administracion
    const empresaData = {
      nombre_legal: registroDto.nombre_legal,
      nombre_comercial: registroDto.nombre_comercial,
      email_contacto: registroDto.email,
      nif_cif: registroDto.nif_cif,
    };

    let empresa;
    try {
      empresa = await firstValueFrom(
        this.natsClient.send('admin.crear_empresa', empresaData)
      );
    } catch (e) {
      throw new RpcException({ status: 400, message: 'Error al crear la empresa', error: e });
    }

    // 2. Crear el Almacén "General" por defecto
    try {
      await firstValueFrom(
        this.natsClient.send({ cmd: 'create_almacen' }, {
          id_empresa: empresa.id_empresa,
          nombre: 'General',
          codigo: 'GEN-01',
          estado: 'activo'
        })
      );
    } catch (e) {
      // Solo logueamos el error para no romper el flujo de registro en caso de falla
      console.error('Error al crear el almacén por defecto:', e);
    }

    // 3. Crear el Usuario (dueño) en ms-usuarios
    // Buscamos el rol global SuperAdmin
    const superAdminRole = await this.rolesService.findSystemRoleByName('SuperAdmin');

    const usuarioData = {
      nombre: registroDto.nombre_usuario,
      email: registroDto.email,
      password: registroDto.password,
      empresaId: empresa.id_empresa,
      rolId: superAdminRole?.id_rol,
    };

    const usuario = await this.usuariosService.crearUsuario(usuarioData, true);

    // 4. Autologuear al usuario
    return this.login({ email: usuario.email, password: registroDto.password });
  }
}
