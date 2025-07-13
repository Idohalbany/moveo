import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { TasksService, Task, TaskStatus } from './tasks.service';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

class CreateTaskDto {
  @IsNotEmpty()
  name!: string;

  @IsEnum(TaskStatus)
  status!: TaskStatus;
}

class UpdateTaskDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('/calls/:callId/tasks')
  async getTasksForCall(@Param('callId') callId: string): Promise<Task[]> {
    return this.tasksService.findByCallId(callId);
  }

  @Post('/calls/:callId/tasks')
  async createTask(
    @Param('callId') callId: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const { name, status } = createTaskDto;
    return this.tasksService.createTask(callId, name, status);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { name, status } = updateTaskDto;
    return this.tasksService.updateTask(id, name, status);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
