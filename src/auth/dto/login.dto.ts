import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  divisionId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
