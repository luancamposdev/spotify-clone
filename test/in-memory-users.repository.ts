import type {UsersEntity} from "@core/users/entities/users.entity";

import {UsersRepository} from "@core/users/users.repository";

import type {EmailVO} from "@core/users/value-objects/email.vo";

export class InMemoryUsersRepository extends UsersRepository {
  private users: UsersEntity[] = [];

  async register(user: UsersEntity): Promise<void> {
    this.users.push(user);

    console.log(this.users);
  }

  async save(user: UsersEntity): Promise<void> {
    const index = this.users.findIndex((i) => i.id === user.id);
    this.users[index] = user;
  }

  async findById(id: string): Promise<UsersEntity | null> {
    return this.users.find((i) => i.id === id) ?? null;
  }

  async existsByEmail(email: EmailVO): Promise<boolean> {
    return this.users.some((i) => i.email.value === email.value);
  }
}
