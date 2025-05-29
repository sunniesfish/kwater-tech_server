import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manager } from './schemas/manager.schema';
import { CreateManagerDto } from './dto/create-manager.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(Manager.name) private readonly managerModel: Model<Manager>,
  ) {}

  async create(createManagerDto: CreateManagerDto): Promise<Manager> {
    const hashedPassword = await bcrypt.hash(createManagerDto.password, 10);
    const createdManager = new this.managerModel({
      ...createManagerDto,
      password: hashedPassword,
    });
    return createdManager.save();
  }

  async findAll(): Promise<Manager[]> {
    return this.managerModel.find().exec();
  }

  async findOne(managerId: string): Promise<Manager> {
    const manager = await this.managerModel.findOne({ managerId }).exec();
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }
    return manager;
  }

  async update(
    managerId: string,
    updateManagerDto: Partial<CreateManagerDto>,
  ): Promise<Manager> {
    if (updateManagerDto.password) {
      updateManagerDto.password = await bcrypt.hash(
        updateManagerDto.password,
        10,
      );
    }
    const updatedManager = await this.managerModel
      .findOneAndUpdate({ managerId }, updateManagerDto, { new: true })
      .exec();
    if (!updatedManager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }
    return updatedManager;
  }

  async remove(managerId: string): Promise<void> {
    const result = await this.managerModel.deleteOne({ managerId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }
  }
}
