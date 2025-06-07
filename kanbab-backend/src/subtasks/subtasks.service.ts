import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async create(createSubtaskDto: CreateSubtaskDto) {
    return this.prisma.subtask.create({
      data: createSubtaskDto,
    });
  }

  async findAll() {
    return this.prisma.subtask.findMany();
  }

  async findOne(id: string) {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id },
    });
    if (!subtask) {
      throw new NotFoundException('Subtask not found');
    }
    return subtask;
  }

  async update(id: string, updateSubtaskDto: UpdateSubtaskDto) {
    try {
      return await this.prisma.subtask.update({
        where: { id },
        data: updateSubtaskDto,
      });
    } catch (error) {
      throw new NotFoundException('Subtask not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.subtask.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Subtask not found');
    }
  }
}
