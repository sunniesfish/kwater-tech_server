import { ApiProperty } from '@nestjs/swagger';

export class ManagerResponseDto {
  @ApiProperty({
    description: '관리자 ID',
    example: 'manager001',
  })
  managerId: string;

  @ApiProperty({
    description: '관리자 이름',
    example: '홍길동',
  })
  managerName: string;
}
