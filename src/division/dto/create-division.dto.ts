import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDivisionDto {
  @ApiProperty({
    description: '사업소 ID',
    example: 'D001',
  })
  @IsNotEmpty()
  @IsString()
  divisionId: string;

  @ApiProperty({
    description: '사업소명',
    example: '본사',
  })
  @IsNotEmpty()
  @IsString()
  divisionName: string;
}
