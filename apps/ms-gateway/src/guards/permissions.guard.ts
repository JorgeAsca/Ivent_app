import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Si no hay usuario, el AuthGuard fallará primero. Si llega aquí sin usuario, denegar.
    if (!user) {
      return false;
    }

    // El superadmin o admin tiene acceso total a todo (si su rolNombre lo dice)
    const rolNombre = user.rolNombre?.toLowerCase();
    if (rolNombre === 'superadmin' || rolNombre === 'admin') {
      return true;
    }

    const userPermissions = user.permisos || [];
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
    
    if (!hasPermission) {
      throw new ForbiddenException(`No tienes permisos suficientes para realizar esta acción. Requerido: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}
