import { Test, TestingModule } from "@nestjs/testing";
import { AgendaService } from "./agenda.service";
import { Agenda } from "agenda";
import { User } from "./entities/user.entity";
import * as birthdayJob from "./jobs/birthday.job";

jest.mock("agenda");
jest.mock("./jobs/birthday.job");

describe("AgendaService", () => {
  let service: AgendaService;
  let mockAgenda: jest.Mocked<Agenda>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgendaService],
    }).compile();

    service = module.get<AgendaService>(AgendaService);
    mockAgenda = new Agenda() as jest.Mocked<Agenda>;
    (service as any).agenda = mockAgenda;
  });

  describe("scheduleUserBirthday", () => {
    it("should call scheduleBirthdayJob with the agenda instance and user", async () => {
      const user: User = { id: "1", name: "John Doe", email: "john.doe@example.com", birthday: "2025-04-23", timezone: "UTC" };
      const scheduleBirthdayJobSpy = jest.spyOn(birthdayJob, "scheduleBirthdayJob").mockResolvedValue();

      await service.scheduleUserBirthday(user);

      expect(scheduleBirthdayJobSpy).toHaveBeenCalledWith(mockAgenda, user);
    });
  });
});