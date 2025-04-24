import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class WorkerService {
  constructor(private readonly httpService: HttpService) {}

  async scheduleUser(user: User) {
    await firstValueFrom(
      this.httpService.post("http://birthday-worker:3001/schedule", user)
    );
  }

  async rescheduleUser(user: User) {
    await firstValueFrom(
      this.httpService.post("http://birthday-worker:3001/reschedule", user)
    );
  }

  async removeUser(user: User) {
    await firstValueFrom(
      this.httpService.post("http://birthday-worker:3001/remove", user)
    );
  }
}
