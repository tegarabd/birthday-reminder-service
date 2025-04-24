import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { WorkerService } from "../worker/worker.service";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;
  let userRepository: MongoRepository<User>;
  let workerService: WorkerService;

  beforeEach(async () => {
    const mockUserRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockWorkerService = {
      scheduleUser: jest.fn(),
      rescheduleUser: jest.fn(),
      removeUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: WorkerService,
          useValue: mockWorkerService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MongoRepository<User>>(
      getRepositoryToken(User)
    );
    workerService = module.get<WorkerService>(WorkerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a user and schedule it", async () => {
      const createUserDto = {
        name: "John Doe",
        birthday: "2000-01-01",
        email: "john.doe@example.com",
        timezone: "UTC",
      };
      const savedUser = { id: new ObjectId(), ...createUserDto };

      jest.spyOn(userRepository, "save").mockResolvedValue(savedUser);
      jest.spyOn(workerService, "scheduleUser").mockResolvedValue(undefined);

      const result = await service.create(createUserDto as any);

      expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
      expect(workerService.scheduleUser).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: new ObjectId(),
          name: "John Doe",
          birthday: "2000-01-01",
          email: "john.doe@example.com",
          timezone: "UTC",
        },
      ];

      jest.spyOn(userRepository, "find").mockResolvedValue(users);

      const result = await service.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      const user = {
        id: new ObjectId(),
        name: "John Doe",
        birthday: "2000-01-01",
        email: "john.doe@example.com",
        timezone: "UTC",
      };

      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);

      const result = await service.findOne("68075863cda8eccf832dec43");

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { _id: expect.any(Object) },
      });
      expect(result).toEqual(user);
    });

    it("should throw NotFoundException if user is not found", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(service.findOne("68075863cda8eccf832dec42")).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw BadRequestException if id is invalid", async () => {
      await expect(service.findOne("invalid-id")).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("update", () => {
    it("should update a user and reschedule it", async () => {
      const user = { id: "1", name: "John Doe", birthday: "2000-01-01" };
      const updateUserDto = { name: "Jane Doe" };
      const updatedUser = { ...user, ...updateUserDto };

      jest.spyOn(service, "findOne").mockResolvedValue(user as any);
      jest.spyOn(userRepository, "update").mockResolvedValue(undefined);
      jest.spyOn(workerService, "rescheduleUser").mockResolvedValue(undefined);

      const result = await service.update("1", updateUserDto as any);

      expect(service.findOne).toHaveBeenCalledWith("1");
      expect(userRepository.update).toHaveBeenCalledWith("1", updateUserDto);
      expect(workerService.rescheduleUser).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("remove", () => {
    it("should remove a user and unschedule it", async () => {
      const user = { id: "1", name: "John Doe", birthday: "2000-01-01" };

      jest.spyOn(service, "findOne").mockResolvedValue(user as any);
      jest.spyOn(userRepository, "delete").mockResolvedValue(undefined);
      jest.spyOn(workerService, "removeUser").mockResolvedValue(undefined);

      const result = await service.remove("1");

      expect(service.findOne).toHaveBeenCalledWith("1");
      expect(userRepository.delete).toHaveBeenCalledWith("1");
      expect(workerService.removeUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});
