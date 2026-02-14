
import { Controller, Post, Body } from '@nestjs/common';
import { AiService, ChatResponse } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('chat')
    async chat(@Body('message') message: string): Promise<ChatResponse> {
        return this.aiService.processMessage(message);
    }
}
