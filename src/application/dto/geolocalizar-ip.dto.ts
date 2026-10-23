import { ApiProperty } from '@nestjs/swagger';
import { IsIP } from 'class-validator';

export class GeolocalizarIpDto {
  @ApiProperty({ example: '181.49.10.20', description: 'Dirección IP (v4 o v6) de quien hace la compra.' })
  @IsIP()
  ip!: string;
}
