import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { WorkerService } from "../worker/worker.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly workerService: WorkerService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save(createUserDto);
    await this.workerService.scheduleUser(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    let _id: ObjectId;

    try {
      _id = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException("Id are not valid.");
    }

    const user = await this.userRepository.findOne({
      where: { _id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = { ...user, ...updateUserDto };
    await Promise.all([
      this.userRepository.update(id, updateUserDto),
      this.workerService.rescheduleUser(updatedUser),
    ]);
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await Promise.all([
      this.userRepository.delete(id),
      this.workerService.removeUser(user),
    ]);
    return user;
  }
}
