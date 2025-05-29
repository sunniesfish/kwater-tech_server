import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Division } from './schemas/division.schema';
import { CreateDivisionDto } from './dto/create-division.dto';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectModel(Division.name)
    private readonly divisionModel: Model<Division>,
  ) {}

  async findAll(): Promise<Division[]> {
    return this.divisionModel.find().exec();
  }

  async create(createDivisionDto: CreateDivisionDto): Promise<Division> {
    const createdDivision = new this.divisionModel({
      ...createDivisionDto,
    });
    return createdDivision.save();
  }

  async findOne(divisionId: string): Promise<Division> {
    const division = await this.divisionModel.findOne({ divisionId }).exec();
    if (!division) {
      throw new NotFoundException(
        `Division with divisionId ${divisionId} not found`,
      );
    }
    return division;
  }

  async update(
    divisionId: string,
    updateDivisionDto: Partial<CreateDivisionDto>,
  ): Promise<Division> {
    const updatedDivision = await this.divisionModel
      .findOneAndUpdate({ divisionId }, updateDivisionDto, { new: true })
      .exec();
    if (!updatedDivision) {
      throw new NotFoundException(
        `Division with divisionId ${divisionId} not found`,
      );
    }
    return updatedDivision;
  }

  async remove(divisionId: string): Promise<void> {
    const result = await this.divisionModel.deleteOne({ divisionId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Division with divisionId ${divisionId} not found`,
      );
    }
  }
}
