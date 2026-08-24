import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class StartRefreshDto {
  @ApiProperty({ description: 'Chave estavel para repetir a mesma janela sem duplicar o job.' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  idempotencyKey!: string;
}
