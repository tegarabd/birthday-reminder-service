import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerModule } from "src/worker/worker.module";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), WorkerModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
