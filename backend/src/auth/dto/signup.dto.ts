import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message: 'Password must be 8 chars contain letter number and  special char',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
