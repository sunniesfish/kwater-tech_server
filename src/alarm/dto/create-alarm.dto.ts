import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Day } from '../../global/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlarmDto {
  @ApiProperty({
    description: '요일',
    enum: Day,
    example: Day.MONDAY,
  })
  @IsNotEmpty()
  @IsEnum(Day)
  day: Day;

  @ApiProperty({
    description: '시간 (0-23)',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  hour: number;

  @ApiProperty({
    description: '분 (0-59)',
    example: 30,
  })
  @IsNotEmpty()
  @IsNumber()
  minute: number;

  @ApiProperty({
    description: '반복 여부',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  repeat: boolean;

  @ApiProperty({
    description: '마지막 알림 시간 (Unix timestamp)',
    example: 1678886400,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lastTriggered?: number;

  @ApiProperty({
    description: '알림 제목',
    example: '아침 정기 방송',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '음원 ID',
    example: 'music_001',
  })
  @IsNotEmpty()
  @IsString()
  musicId: string;
}
