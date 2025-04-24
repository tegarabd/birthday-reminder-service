import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsTimeZone,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required." })
  name: string;

  @IsEmail({}, { message: "Email must be a valid email." })
  @IsNotEmpty({ message: "Email is required." })
  email: string;

  @IsDateString({}, { message: "Birthday must be a valid date." })
  @IsNotEmpty({ message: "Birthday is required." })
  birthday: string;

  @IsTimeZone({ message: "Timezone must be a valid IANA time-zone." })
  @IsNotEmpty({ message: "Timezone is required." })
  timezone: string;
}
