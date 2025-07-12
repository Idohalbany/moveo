import { Controller, Get } from '@nestjs/common';
import { CallsService, Call } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  async getAllCalls(): Promise<Call[]> {
    return this.callsService.findAll();
  }
}
