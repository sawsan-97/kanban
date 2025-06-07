import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
