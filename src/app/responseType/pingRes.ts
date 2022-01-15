import { ApiProperty } from '@nestjs/swagger';

export class PingRes {
  @ApiProperty({
    type: String,
  })
  message: string;
}
