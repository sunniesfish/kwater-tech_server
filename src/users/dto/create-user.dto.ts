import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { Division } from '../../global/types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsEnum(Division)
  division: Division;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  // 실제 프로덕션에서는 정규식을 사용하여 더 복잡한 비밀번호 정책을 적용하는 것이 좋습니다.
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
  password: string;
}
