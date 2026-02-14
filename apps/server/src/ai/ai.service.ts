
import { Injectable } from '@nestjs/common';

export interface ChatResponse {
    message: string;
    relatedLinks?: { title: string; url: string }[];
}

@Injectable()
export class AiService {
    async processMessage(userMessage: string): Promise<ChatResponse> {
        const msg = userMessage.toLowerCase();

        if (msg.includes('barco') || msg.includes('lancha') || msg.includes('transporte')) {
            return {
                message: 'Para viajar por la selva, contamos con rápidas y lanchas de carga. ¿Te gustaría ver los horarios disponibles para Nauta o Requena?',
                relatedLinks: [{ title: 'Ver Barcos', url: '/boats' }, { title: 'Ver Rutas', url: '/routes' }]
            };
        }

        if (msg.includes('comer') || msg.includes('restaurante') || msg.includes('comida')) {
            return {
                message: '¡La gastronomía amazónica es deliciosa! Te recomiendo probar el Juane o el Tacacho con Cecina. Tenemos varios restaurantes aliados.',
                relatedLinks: [{ title: 'Ver Restaurantes', url: '/restaurants' }]
            };
        }

        if (msg.includes('tour') || msg.includes('turismo') || msg.includes('experiencia')) {
            return {
                message: 'Tenemos experiencias increíbles: desde visitas a comunidades nativas hasta expediciones nocturnas. ¿Qué tipo de aventura buscas?',
                relatedLinks: [{ title: 'Ver Experiencias', url: '/experiences' }]
            };
        }

        return {
            message: 'Soy SelvaAI, tu asistente virtual. Puedo ayudarte con información sobre barcos, rutas, restaurantes y turismo en la selva. ¿En qué te puedo ayudar hoy?'
        };
    }
}
