import Agenda, { Job } from "agenda";
import moment from "moment-timezone";
import { User } from "../entities/user.entity";

export function defineJobs(agenda: Agenda) {
  agenda.define("send-birthday-message", async (job: Job) => {
    const user = job.attrs.data;
    console.log(`🎉 Happy Birthday ${user.name} (${user.email})!`);

    const now = moment();
    const birthdayNextYear = moment(user.birthday)
      .year(now.year())
      .add(1, "year");

    const userLocalTime = moment
      .tz(birthdayNextYear.format("YYYY-MM-DD"), user.timezone)
      .set({
        hour: parseInt(process.env.REMINDER_HOUR!),
        minute: parseInt(process.env.REMINDER_MINUTE!),
      });

    await agenda.schedule(
      userLocalTime.toDate(),
      "send-birthday-message",
      user
    );
  });
}

export async function scheduleBirthdayJob(agenda: Agenda, user: User) {
  const now = moment();
  const birthdayThisYear = moment(user.birthday).year(now.year());

  const userLocalTime = moment
    .tz(birthdayThisYear.format("YYYY-MM-DD"), user.timezone)
    .set({
      hour: parseInt(process.env.REMINDER_HOUR!),
      minute: parseInt(process.env.REMINDER_MINUTE!),
    });

  if (userLocalTime.isBefore(now)) {
    userLocalTime.add(1, "year");
  }

  await agenda.schedule(userLocalTime.toDate(), "send-birthday-message", {
    ...user,
    jobName: `birthday-${user.id}`,
  });

  console.log(
    `Scheduled birthday job for ${user.name} at ${userLocalTime.format()}`
  );
}
