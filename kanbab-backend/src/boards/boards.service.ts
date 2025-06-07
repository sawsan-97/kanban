import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: createBoardDto,
      include: {
        columns: true,
      },
    });
  }

  async findAll() {
    return this.prisma.board.findMany({
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    try {
      return await this.prisma.board.update({
        where: { id },
        data: updateBoardDto,
        include: {
          columns: true,
        },
      });
    } catch (_error) {
      throw new NotFoundException('Board not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.board.delete({
        where: { id },
      });
    } catch (_error) {
      throw new NotFoundException('Board not found');
    }
  }
}
