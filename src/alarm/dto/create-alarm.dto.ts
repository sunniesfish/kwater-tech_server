import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Day } from '../../global/types';

export class CreateAlarmDto {
  @IsNotEmpty()
  @IsEnum(Day)
  day: Day;

  @IsNotEmpty()
  @IsNumber()
  hour: number;

  @IsNotEmpty()
  @IsNumber()
  minute: number;

  @IsNotEmpty()
  @IsBoolean()
  repeat: boolean;

  @IsOptional()
  @IsNumber()
  lastTriggered?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  musicId: string;
}
