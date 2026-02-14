import {describe, expect, it} from "bun:test";
import {Role, type SocialProvider, UsersEntity,} from "@core/users/entities/users.entity";
import {EmailVO} from "@core/users/value-objects/email.vo";
import {NameVO} from "@core/users/value-objects/name.vo";
import {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";
import {LoginWithSocialUseCase} from "@/application/use-cases/users/login-with-social.usecase";
import {InMemoryUsersRepository} from "../../../in-memory-users.repository";

describe("LoginWithSocialUseCase", () => {
  it("should return user when social login exists", async () => {
    const repo = new InMemoryUsersRepository();

    const hash = await PasswordHashVO.fromPlain("123456");

    const user = new UsersEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      avatarUrl: null,
      passwordHash: hash,
      role: Role.LISTENER,
    });

    user.addSocialLogin({
      provider: "github" satisfies SocialProvider,
      providerId: "github-123",
    });

    await repo.register(user);

    const loginWithSocialUseCase = new LoginWithSocialUseCase(repo);

    const result = await loginWithSocialUseCase.execute({
      provider: "github",
      providerId: "github-123",
    });

    expect(result).not.toBeNull();
    expect(result?.userId).toBe(user.id);
    expect(result?.role).toBe(Role.LISTENER);
  });

  // it("should return null when social login does not exist", async () => {
  //   const repo = new InMemoryUsersRepository();
  //
  //   const useCase = new LoginWithSocialUseCase(repo);
  //
  //   const result = await useCase.execute({
  //     provider: SocialProvider.GITHUB,
  //     providerId: "not-found",
  //   });
  //
  //   expect(result).toBeNull();
  // });
});
