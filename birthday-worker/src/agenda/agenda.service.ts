import { Injectable, OnModuleInit } from "@nestjs/common";
import { Agenda } from "agenda";
import { User } from "./entities/user.entity";
import { defineJobs, scheduleBirthdayJob } from "./jobs/birthday.job";

@Injectable()
export class AgendaService implements OnModuleInit {
  private agenda: Agenda;

  async onModuleInit() {
    this.agenda = new Agenda({ db: { address: process.env.MONGO_URI! } });
    defineJobs(this.agenda);
    await this.agenda.start();
  }

  async scheduleUserBirthday(user: User) {
    await scheduleBirthdayJob(this.agenda, user);
  }

  async rescheduleUserBirthday(user: User) {
    await this.removeUserBirthday(user.id);
    await this.scheduleUserBirthday(user);
  }

  async removeUserBirthday(id: string) {
    const jobName = `birthday-${id}`;
    await this.agenda.cancel({ name: jobName });
  }

  async stop() {
    await this.agenda.stop();
  }
}
