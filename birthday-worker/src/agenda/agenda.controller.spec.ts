import { Test, TestingModule } from "@nestjs/testing";
import { AgendaController } from "./agenda.controller";
import { AgendaService } from "./agenda.service";
import { ScheduleReminderDto } from "./dto/schedule-reminder.dto";
import { RescheduleReminderDto } from "./dto/reschedule-reminder.dto";
import { RemoveReminderDto } from "./dto/remove-reminder.dto";

describe("AgendaController", () => {
  let agendaController: AgendaController;
  let agendaService: AgendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendaController],
      providers: [
        {
          provide: AgendaService,
          useValue: {
            scheduleUserBirthday: jest.fn(),
            rescheduleUserBirthday: jest.fn(),
            removeUserBirthday: jest.fn(),
          },
        },
      ],
    }).compile();

    agendaController = module.get<AgendaController>(AgendaController);
    agendaService = module.get<AgendaService>(AgendaService);
  });

  describe("scheduleUser", () => {
    it("should schedule a user birthday", async () => {
      const dto: ScheduleReminderDto = { 
        id: "123", 
        birthday: "2023-10-10", 
        name: "John Doe", 
        email: "john.doe@example.com", 
        timezone: "UTC" 
      };
      const result = await agendaController.scheduleUser(dto);

      expect(agendaService.scheduleUserBirthday).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: "Scheduled" });
    });
  });

  describe("rescheduleUser", () => {
    it("should reschedule a user birthday", async () => {
      const dto: RescheduleReminderDto = {
        id: "123",
        birthday: "2023-11-11",
        name: "John Doe",
        email: "john.doe@example.com",
        timezone: "UTC",
      };
      const result = await agendaController.rescheduleUser(dto);

      expect(agendaService.rescheduleUserBirthday).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: "Rescheduled" });
    });
  });

  describe("removeUser", () => {
    it("should remove a user birthday", async () => {
      const dto: RemoveReminderDto = { id: "123" };
      const result = await agendaController.removeUser(dto);

      expect(agendaService.removeUserBirthday).toHaveBeenCalledWith(dto.id);
      expect(result).toEqual({ message: "Removed" });
    });
  });
});