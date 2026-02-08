import {describe, expect, it} from "bun:test";

import {Role, UserEntity} from "@core/users/entities/user.entity";
import {AvatarUrlVO} from "@core/users/value-objects/avatar-url.vo";
import {EmailVO} from "@core/users/value-objects/email.vo";
import {NameVO} from "@core/users/value-objects/name.vo";
import {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";

describe("User Entity", () => {
  it("Should be able to create user", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    const user = new UserEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      avatarUrl: AvatarUrlVO.create("https://github.com/luancamposdev.png"),
      passwordHash: hash,
      role: Role.LISTENER,
    });

    expect(user).toBeTruthy();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.deletedAccountAt).toBeUndefined();
  });

  it("Should allow updating the avatar URL", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    const user = new UserEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      avatarUrl: AvatarUrlVO.create("https://github.com/luancamposdev.png"),
      passwordHash: hash,
      role: Role.LISTENER,
    });

    user.avatarUrl = AvatarUrlVO.create("https://cdn.com/luancamposdev2.png");

    if (!user.avatarUrl) return;

    expect(user.avatarUrl.value).toBe("https://cdn.com/luancamposdev2.png");
  });

  it("Should add social login", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    const user = new UserEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luan@mail.com"),
      avatarUrl: AvatarUrlVO.create("https://github.com/luancamposdev.png"),
      passwordHash: hash,
      role: Role.LISTENER,
    });

    user.addSocialLogin({
      provider: "github",
      providerId: "123456789",
    });

    const found = user.findSocialLogin("github", "123456789");

    expect(found).toBeTruthy();
    expect(found?.provider).toBe("github");
    expect(found?.providerId).toBe("123456789");
  });

  it("Should attach artist profile and switch role", async () => {
    const hash = await PasswordHashVO.fromPlain("artist123");

    const user = new UserEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luancampos@mail.com"),
      avatarUrl: null,
      passwordHash: hash,
      role: Role.LISTENER,
    });

    user.attachArtistProfile("artist-id-1");

    expect(user.artistProfile?.id).toBe("artist-id-1");
    expect(user.role).toBe(Role.ARTIST);
  });

  it("Should delete account", async () => {
    const hash = await PasswordHashVO.fromPlain("delete123");

    const user = new UserEntity({
      name: NameVO.create("Luan Campos"),
      email: EmailVO.create("luancampos@mail.com"),
      avatarUrl: null,
      passwordHash: hash,
      role: Role.LISTENER,
    });

    user.deleteAccount();

    expect(user.deletedAccountAt).toBeInstanceOf(Date);
    expect(user.isDeleted).toBe(true);
  });
});
