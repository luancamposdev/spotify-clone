import type {UsersEntity} from "@core/users/entities/users.entity";

import type {EmailVO} from "@core/users/value-objects/email.vo";

export abstract class UsersRepository {
  abstract findById(id: string): Promise<UsersEntity | null>;
  // abstract findByEmail(email: EmailVO): Promise<UsersEntity | null>;
  abstract register(user: UsersEntity): Promise<void>;
  // abstract save(user: UsersEntity): Promise<void>;
  abstract existsByEmail(email: EmailVO): Promise<boolean>;
  // abstract findBySocialLogin(
  //   provider: string,
  //   providerId: string,
  // ): Promise<UsersEntity | null>;
}
