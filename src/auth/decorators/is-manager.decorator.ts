import { SetMetadata } from '@nestjs/common';

export const IS_MANAGER_KEY = 'isManager';
export const IsManager = () => SetMetadata(IS_MANAGER_KEY, true);
