import {describe, expect, it} from "bun:test";
import {Role, UsersEntity} from "@core/users/entities/users.entity";
import {EmailVO} from "@core/users/value-objects/email.vo";
import {NameVO} from "@core/users/value-objects/name.vo";
import {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";
import {AttachSocialLoginUseCase} from "@/application/use-cases/users/attach-social-login.usecase";
import {InMemoryUsersRepository} from "../../../in-memory-users.repository";

describe("AttacheSocialLoginUseCase", () => {
  const repository = new InMemoryUsersRepository();
  const attachSocialLoginUseCase = new AttachSocialLoginUseCase(repository);

  it("Should attach a social login to existing user", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123456");

    const user = new UsersEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      passwordHash: hash,
      avatarUrl: null,
      role: Role.LISTENER,
    });

    await repository.register(user);

    await attachSocialLoginUseCase.execute({
      userId: user.id,
      provider: "github",
      providerId: "github-123",
    });

    const saved = await repository.findById(user.id);

    expect(saved).toBeTruthy();
    expect(saved?.socialLogins.length).toBe(1);
    expect(saved?.socialLogins[0].provider).toBe("github");
    expect(saved?.socialLogins[0].providerId).toBe("github-123");
  });

  it("Should not duplicate same social login", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123456");

    const user = new UsersEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      passwordHash: hash,
      avatarUrl: null,
      role: Role.ARTIST,
    });

    user.addSocialLogin({
      provider: "github",
      providerId: "github-123",
    });

    await repository.register(user);

    await attachSocialLoginUseCase.execute({
      userId: user.id,
      provider: "github",
      providerId: "github-123",
    });

    const saved = await repository.findById(user.id);

    expect(saved).toBeTruthy();
    expect(saved?.socialLogins.length).toBe(1);
  });

  it("Should throw when user does not exist", async () => {
    expect(
      attachSocialLoginUseCase.execute({
        userId: "not-found",
        provider: "google",
        providerId: "g-1",
      }),
    ).rejects.toThrow("User not found");
  });
});
