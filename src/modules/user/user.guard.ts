import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Context } from 'telegraf';
// export function userGuard() {
//   const userService = Inject(HistoryService);
//
//   return (
//     target: any,
//     propertyKey: string,
//     propertyDescriptor: PropertyDescriptor,
//   ) => {
//     //get original method
//     const originalMethod = propertyDescriptor.value;
//
//     originalMethod.value = function (...args: any[]) {
//       console.log('--- user guard method');
//       return originalMethod.apply(this, args);
//     };
//   };
// }
//
// export function validateString(
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor,
// ): void {
//   const originalMethod = descriptor.value;
//   descriptor.value = function (...args: any) {
//     // Execute original method
//     return Reflect.apply(originalMethod, this, args);
//   };
// }

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getArgByIndex(0) as Context;

    if (ctx.from.is_bot) return false;
    const userId = ctx.from.id;
    return !!(await this.userService.getUserById(userId.toString()));
  }
}
