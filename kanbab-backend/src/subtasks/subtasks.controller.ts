import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Subtasks')
@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subtask' })
  @ApiResponse({ status: 201, description: 'Subtask created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createSubtaskDto: CreateSubtaskDto) {
    return this.subtasksService.create(createSubtaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subtasks' })
  @ApiResponse({ status: 200, description: 'Subtasks retrieved successfully' })
  findAll() {
    return this.subtasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific subtask' })
  @ApiResponse({ status: 200, description: 'Subtask retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Subtask not found' })
  findOne(@Param('id') id: string) {
    return this.subtasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask updated successfully' })
  @ApiResponse({ status: 404, description: 'Subtask not found' })
  update(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.subtasksService.update(id, updateSubtaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subtask not found' })
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
