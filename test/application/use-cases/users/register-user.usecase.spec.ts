import {describe, expect, it} from "bun:test";

import {RegisterUserUseCaseImpl} from "@/application/use-cases/users/register-user.usecase";
import {InMemoryUsersRepository} from "../../../in-memory-users.repository";

describe("Register User Use Case", () => {
  it("Should register a new user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserUseCase = new RegisterUserUseCaseImpl(usersRepository);

    const result = await registerUserUseCase.execute({
      name: "Luan Campos",
      email: "luan@mail.com",
      avatarUrl: "https://cdn.campos/luan.png",
      password: "strong123",
    });

    expect(result.userId).toBeString();

    const saved = await usersRepository.findById(result.userId);

    expect(saved).not.toBeNull();
    expect(saved?.email.value).toBe("luan@mail.com");
  });

  it("Should not allow duplicate email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserUseCase = new RegisterUserUseCaseImpl(usersRepository);

    await registerUserUseCase.execute({
      name: "Luan Campos",
      email: "luan@mail.com",
      password: "strong123",
    });

    expect(() =>
      registerUserUseCase.execute({
        name: "Outro Nome",
        email: "luan@mail.com",
        password: "strong123456",
      }),
    ).toThrow();
  });
});
