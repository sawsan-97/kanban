import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new column' })
  @ApiResponse({ status: 201, description: 'Column created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all columns' })
  @ApiResponse({ status: 200, description: 'Columns retrieved successfully' })
  findAll() {
    return this.columnsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific column' })
  @ApiResponse({ status: 200, description: 'Column retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Column not found' })
  findOne(@Param('id') id: string) {
    return this.columnsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a column' })
  @ApiResponse({ status: 200, description: 'Column updated successfully' })
  @ApiResponse({ status: 404, description: 'Column not found' })
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(id, updateColumnDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a column' })
  @ApiResponse({ status: 200, description: 'Column deleted successfully' })
  @ApiResponse({ status: 404, description: 'Column not found' })
  remove(@Param('id') id: string) {
    return this.columnsService.remove(id);
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Change the order of a column' })
  @ApiBody({
    schema: { properties: { newOrder: { type: 'integer', example: 2 } } },
  })
  @ApiResponse({
    status: 200,
    description: 'Column order updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Column not found' })
  changeOrder(@Param('id') id: string, @Body('newOrder') newOrder: number) {
    return this.columnsService.changeOrder(id, newOrder);
  }
}
