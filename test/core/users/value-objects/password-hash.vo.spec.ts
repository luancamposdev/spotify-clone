import {describe, expect, it} from "bun:test";
import {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";

describe("PasswordHashVO", () => {
  it("Should be able create from valid plain password", async () => {
    const password = "strong123";
    const hash = await PasswordHashVO.fromPlain(password);

    expect(hash).toBeInstanceOf(PasswordHashVO);
    expect(typeof hash.value).toBe("string");
    expect(hash.value.length).toBeGreaterThan(20);
    expect(hash.value).not.toBe("strong123");
  });

  it("Should throw when password is too short", async () => {
    expect(PasswordHashVO.fromPlain("123")).rejects.toThrow();
  });

  it("Should throw when password is empty", async () => {
    expect(PasswordHashVO.fromPlain("")).rejects.toThrow();
  });

  it("Should create from existing hash", async () => {
    const original = await PasswordHashVO.fromPlain("strong123");

    const restored = PasswordHashVO.fromHash(original.value);

    expect(restored).toBeInstanceOf(PasswordHashVO);
    expect(restored.value).toBe(original.value);
  });

  it("Should verify correct password", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    const ok = await hash.verify("strong123");
    expect(ok).toBe(true);
  });

  it("Should reject wrong password", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    const ok = await hash.verify("wrongness");

    expect(ok).toBe(false);
  });

  it("Should not leak hash in toString()", async () => {
    const hash = await PasswordHashVO.fromPlain("strong123");

    expect(hash.toString()).toBe("[PasswordHash]");
  });
});
