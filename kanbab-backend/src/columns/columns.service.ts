import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(createColumnDto: CreateColumnDto) {
    return this.prisma.column.create({
      data: createColumnDto,
      include: {
        tasks: true,
      },
    });
  }

  async findAll() {
    return this.prisma.column.findMany({
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const column = await this.prisma.column.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
        },
      },
    });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return column;
  }

  async update(id: string, updateColumnDto: UpdateColumnDto) {
    try {
      return await this.prisma.column.update({
        where: { id },
        data: updateColumnDto,
        include: {
          tasks: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Column not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.column.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Column not found');
    }
  }

  async changeOrder(id: string, newOrder: number) {
    const column = await this.prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    return this.prisma.column.update({
      where: { id },
      data: { order: newOrder },
    });
  }
}
