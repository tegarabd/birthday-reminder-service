import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    type: CreateUserDto,
    description: "Create a new user",
    examples: {
      default: {
        summary: "Default User",
        value: {
          name: "John Doe",
          email: "john.doe@example.com",
          birthday: "1999-09-09",
          timezone: "Europe/London",
        } as CreateUserDto,
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiBody({
    type: UpdateUserDto,
    description: "Update a user",
    examples: {
      default: {
        summary: "Default User",
        value: {
          name: "John Doe",
          email: "john.doe@example.com",
          birthday: "1999-09-09",
          timezone: "Europe/London",
        } as UpdateUserDto,
      },
    },
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
