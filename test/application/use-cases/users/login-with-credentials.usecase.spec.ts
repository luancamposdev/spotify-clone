import {describe, expect, it} from "bun:test";
import {Role, UsersEntity} from "@core/users/entities/users.entity";
import {EmailVO} from "@core/users/value-objects/email.vo";
import {NameVO} from "@core/users/value-objects/name.vo";
import {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";
import {LoginWithCredentialsUseCase} from "@/application/use-cases/users/login-with-credentials.usecase";
import {InMemoryUsersRepository} from "../../../in-memory-users.repository";

describe("LoginWithCredentials", () => {
  const repository = new InMemoryUsersRepository();
  const loginWithCredentialsUseCase = new LoginWithCredentialsUseCase(
    repository,
  );

  it("Should login with correct credentials", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    const user = new UsersEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      avatarUrl: null,
      passwordHash: hash,
      role: Role.LISTENER,
    });

    await repository.register(user);

    const result = await loginWithCredentialsUseCase.execute({
      email: "luan@mail.com",
      password: "strong123",
    });

    expect(result.userId).toBe(user.id);
  });
});
