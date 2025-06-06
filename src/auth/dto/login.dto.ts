import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '관리자 ID',
    example: 'admin123',
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9가-힣._@#$%&*+=!?-]+$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Manager ID는 최소 3자 이상이어야 합니다' })
  @MaxLength(20, { message: 'Manager ID는 최대 20자까지 허용됩니다' })
  @Matches(/^[a-zA-Z0-9가-힣._@#$%&*+=!?-]+$/, {
    message:
      'Manager ID는 영문자, 한국어, 숫자, 일반적인 특수문자(._@#$%&*+=!?-)만 허용됩니다',
  })
  managerId: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
    minLength: 6,
    maxLength: 11,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' })
  @MaxLength(11, { message: '비밀번호는 최대 11자까지 허용됩니다' })
  password: string;
}
