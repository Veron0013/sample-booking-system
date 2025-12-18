import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [UsersModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
