import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'manager001',
    description: '관리자 ID',
  })
  managerId: string;

  @ApiProperty({
    example: '홍길동',
    description: '관리자 이름',
  })
  managerName: string;

  @ApiProperty({
    example: 'accessToken',
    description: '액세스 토큰',
  })
  accessToken: string;
}
