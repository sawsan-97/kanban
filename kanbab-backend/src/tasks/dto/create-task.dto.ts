import { IsNotEmpty, IsString, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Implement API',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Task title is required' })
  @IsString({ message: 'Task title must be a string' })
  @MaxLength(500, { message: 'Task title must not exceed 500 characters' })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Implement the API endpoints for task management',
    required: false,
  })
  @IsString({ message: 'Task description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Order of the task in the column',
    example: 1,
  })
  @IsInt({ message: 'Order must be an integer' })
  @Min(0, { message: 'Order must be zero or greater' })
  order: number;

  @ApiProperty({
    description: 'Column ID to which this task belongs',
    example: 'uuid-column-id',
  })
  @IsNotEmpty({ message: 'Column ID is required' })
  @IsString({ message: 'Column ID must be a string' })
  columnId: string;
}
