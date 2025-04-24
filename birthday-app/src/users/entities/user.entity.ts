import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  birthday: string;

  @Column()
  timezone: string;
}
