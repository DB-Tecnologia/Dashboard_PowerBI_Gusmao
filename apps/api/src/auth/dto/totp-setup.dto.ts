import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

const TOTP_CODE_PATTERN = /^\d{6}$/;

export class TotpVerifyDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(TOTP_CODE_PATTERN)
  code!: string;
}

export class TotpDisableDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(TOTP_CODE_PATTERN)
  code!: string;

  @ApiProperty({ example: 'SenhaAtual123!' })
  @IsString()
  password!: string;
}

export class TotpLoginDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  tempToken!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(TOTP_CODE_PATTERN)
  code!: string;
}
