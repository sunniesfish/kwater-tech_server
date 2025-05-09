import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_MANAGER_KEY } from '../decorators/is-manager.decorator';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isManager = this.reflector.getAllAndOverride<boolean>(
      IS_MANAGER_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isManager) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    try {
      const user = await this.userService.getUserById(request.user.id);
      if (user.isManager) {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    throw new UnauthorizedException(
      'You are not authorized to access this resource',
    );
  }
}

export default ManagerGuard;
