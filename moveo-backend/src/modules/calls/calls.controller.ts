import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CallsService, Call } from './calls.service';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateCallDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

class UpdateCallDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  async getAllCalls(): Promise<Call[]> {
    return this.callsService.findAll();
  }

  @Get(':id')
  async getCall(@Param('id') id: string): Promise<Call> {
    const call = await this.callsService.findById(id);
    if (!call) throw new NotFoundException('Call not found');
    return call;
  }

  @Post()
  async createCall(@Body() dto: CreateCallDto): Promise<Call> {
    return this.callsService.createCall(dto.name, dto.tags ?? []);
  }

  @Put(':id')
  async updateCall(
    @Param('id') id: string,
    @Body() dto: UpdateCallDto,
  ): Promise<Call> {
    return this.callsService.updateCall(id, dto.name, dto.tags ?? []);
  }
}
