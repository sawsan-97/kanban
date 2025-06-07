import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    description: 'Board name',
    example: 'My Board',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Board name is required' })
  @IsString({ message: 'Board name must be a string' })
  @MaxLength(255, { message: 'Board name must not exceed 255 characters' })
  name: string;
}
