import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'Board created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'Boards retrieved successfully' })
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific board' })
  @ApiResponse({ status: 200, description: 'Board retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a board' })
  @ApiResponse({ status: 200, description: 'Board updated successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board' })
  @ApiResponse({ status: 200, description: 'Board deleted successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}
