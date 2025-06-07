import { IsNotEmpty, IsString, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Column name',
    example: 'To Do',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Column name is required' })
  @IsString({ message: 'Column name must be a string' })
  @MaxLength(255, { message: 'Column name must not exceed 255 characters' })
  name: string;

  @ApiProperty({
    description: 'Order of the column in the board',
    example: 1,
  })
  @IsInt({ message: 'Order must be an integer' })
  @Min(0, { message: 'Order must be zero or greater' })
  order: number;

  @ApiProperty({
    description: 'Board ID to which this column belongs',
    example: 'uuid-board-id',
  })
  @IsNotEmpty({ message: 'Board ID is required' })
  @IsString({ message: 'Board ID must be a string' })
  boardId: string;
}
