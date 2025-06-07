import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubtaskDto {
  @ApiProperty({
    description: 'Subtask title',
    example: 'Implement API endpoints',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Subtask title is required' })
  @IsString({ message: 'Subtask title must be a string' })
  @MaxLength(500, { message: 'Subtask title must not exceed 500 characters' })
  title: string;

  @ApiProperty({
    description: 'Whether the subtask is completed',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed: boolean;

  @ApiProperty({
    description: 'Task ID to which this subtask belongs',
    example: 'uuid-task-id',
  })
  @IsNotEmpty({ message: 'Task ID is required' })
  @IsString({ message: 'Task ID must be a string' })
  taskId: string;
}
