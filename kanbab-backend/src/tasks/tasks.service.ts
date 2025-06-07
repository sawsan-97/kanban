import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        subtasks: true,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        subtasks: true,
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
        include: {
          subtasks: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  async changeOrder(id: string, newOrder: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.prisma.task.update({
      where: { id },
      data: { order: newOrder },
    });
  }
}
