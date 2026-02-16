import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoatsModule } from './boats/boats.module';
import { RoutesModule } from './routes/routes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { BookingsModule } from './bookings/bookings.module';
import { AiModule } from './ai/ai.module';
import { DebugModule } from './debug/debug.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, BoatsModule, RoutesModule, SchedulesModule, RestaurantsModule, ExperiencesModule, BookingsModule, AiModule, AdminModule, DebugModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
