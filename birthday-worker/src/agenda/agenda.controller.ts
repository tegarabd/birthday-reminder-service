import { Body, Controller, Post } from "@nestjs/common";
import { AgendaService } from "./agenda.service";
import { RemoveReminderDto } from "./dto/remove-reminder.dto";
import { RescheduleReminderDto } from "./dto/reschedule-reminder.dto";
import { ScheduleReminderDto } from "./dto/schedule-reminder.dto";

@Controller()
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post("schedule")
  async scheduleUser(@Body() user: ScheduleReminderDto) {
    await this.agendaService.scheduleUserBirthday(user);
    return { message: "Scheduled" };
  }

  @Post("reschedule")
  async rescheduleUser(@Body() user: RescheduleReminderDto) {
    await this.agendaService.rescheduleUserBirthday(user);
    return { message: "Rescheduled" };
  }

  @Post("remove")
  async removeUser(@Body() user: RemoveReminderDto) {
    await this.agendaService.removeUserBirthday(user.id);
    return { message: "Removed" };
  }
}
