import { Test, TestingModule } from "@nestjs/testing";
import { ObjectId } from "mongodb";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call UsersService.create with correct parameters", async () => {
      const createUserDto: CreateUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        birthday: "1999-09-09",
        timezone: "Europe/London",
      };
      const id = new ObjectId();
      jest.spyOn(service, "create").mockResolvedValue({ id, ...createUserDto });

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ id, ...createUserDto });
    });
  });

  describe("findAll", () => {
    it("should call UsersService.findAll and return the result", async () => {
      const users = [
        {
          id: new ObjectId(),
          name: "John Doe",
          email: "john.doe@example.com",
          birthday: "1999-09-09",
          timezone: "Europe/London",
        },
      ];
      jest.spyOn(service, "findAll").mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe("findOne", () => {
    it("should call UsersService.findOne with correct id and return the result", async () => {
      const user = {
        id: new ObjectId(),
        name: "John Doe",
        email: "john.doe@example.com",
        birthday: "1999-09-09",
        timezone: "Europe/London",
      };
      jest.spyOn(service, "findOne").mockResolvedValue(user);

      const result = await controller.findOne("1");

      expect(service.findOne).toHaveBeenCalledWith("1");
      expect(result).toEqual(user);
    });
  });

  describe("update", () => {
    it("should call UsersService.update with correct parameters", async () => {
      const updateUserDto: UpdateUserDto = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        birthday: "2000-01-01",
        timezone: "America/New_York",
      };
      const updatedUser = {
        id: new ObjectId(),
        name: updateUserDto.name!,
        email: updateUserDto.email!,
        birthday: updateUserDto.birthday!,
        timezone: updateUserDto.timezone!,
      };
      jest.spyOn(service, "update").mockResolvedValue(updatedUser);

      const result = await controller.update("1", updateUserDto);

      expect(service.update).toHaveBeenCalledWith("1", updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("remove", () => {
    it("should call UsersService.remove with correct id", async () => {
      const user = {
        id: new ObjectId(),
        name: "John Doe",
        email: "john.doe@example.com",
        birthday: "1999-09-09",
        timezone: "Europe/London",
      };
      jest.spyOn(service, "remove").mockResolvedValue(user);

      const result = await controller.remove("1");

      expect(service.remove).toHaveBeenCalledWith("1");
      expect(result).toEqual(user);
    });
  });
});
