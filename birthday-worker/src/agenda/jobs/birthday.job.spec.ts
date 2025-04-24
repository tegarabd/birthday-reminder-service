import Agenda, { Job } from "agenda";
import moment from "moment-timezone";
import { defineJobs, scheduleBirthdayJob } from "./birthday.job";
import { User } from "../entities/user.entity";

Date.now = jest.fn(() => new Date("2025-04-13T12:33:37.000Z").getTime());

describe("Birthday Job", () => {
  let agenda: Agenda;

  beforeEach(() => {
    jest.clearAllMocks();
    agenda = {
      define: jest.fn(),
      schedule: jest.fn(),
    } as unknown as Agenda;
  });

  describe("defineJobs", () => {
    it("should define the send-birthday-message job", () => {
      defineJobs(agenda);
      expect(agenda.define).toHaveBeenCalledWith(
        "send-birthday-message",
        expect.any(Function)
      );
    });

    it("should reschedule the job for the next year", async () => {
      defineJobs(agenda);
      const jobHandler = (agenda.define as jest.Mock).mock.calls[0][1];
      const mockJob = {
        attrs: {
          data: {
            name: "John Doe",
            email: "john.doe@example.com",
            birthday: "1990-01-01",
            timezone: "America/New_York",
          },
        },
      };

      const mockSchedule = jest.spyOn(agenda, "schedule").mockResolvedValue(Promise.resolve([] as Job[]));

      await jobHandler(mockJob);

      expect(mockSchedule).toHaveBeenCalled();
    });
  });

  describe("scheduleBirthdayJob", () => {
    it("should schedule a birthday job for the current year", async () => {
      const user: User = {
        id: "1",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        birthday: "1990-09-09",
        timezone: "America/New_York",
      };

      const mockSchedule = jest
        .spyOn(agenda, "schedule")
        .mockResolvedValue(Promise.resolve([] as Job[]));
      const now = moment();
      const userLocalTime = moment
        .tz(user.birthday, user.timezone)
        .year(now.year())
        .set({
          hour: parseInt(process.env.REMINDER_HOUR!),
          minute: parseInt(process.env.REMINDER_MINUTE!),
        });

      await scheduleBirthdayJob(agenda, user);

      expect(mockSchedule).toHaveBeenCalledWith(
        userLocalTime.toDate(),
        "send-birthday-message",
        expect.objectContaining({
          jobName: `birthday-${user.id}`,
        })
      );
    });

    it("should schedule a birthday job for the next year if the birthday has passed", async () => {
      const user: User = {
        id: "2",
        name: "John Smith",
        email: "john.smith@example.com",
        birthday: "1990-01-01",
        timezone: "America/New_York",
      };

      const mockSchedule = jest
        .spyOn(agenda, "schedule")
        .mockResolvedValue(Promise.resolve([] as Job[]));
      const now = moment().add(1, "day");
      jest.spyOn(moment, "tz").mockReturnValue(moment(now));

      await scheduleBirthdayJob(agenda, user);

      expect(mockSchedule).toHaveBeenCalled();
    });
  });
});