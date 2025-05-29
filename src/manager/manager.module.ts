import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { Manager, ManagerSchema } from './schemas/manager.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService], // AuthService에서 사용할 수 있도록 export
})
export class ManagerModule {}
