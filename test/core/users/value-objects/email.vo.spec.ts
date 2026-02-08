import {describe, expect, it} from "bun:test";
import {EmailVO} from "@core/users/value-objects/email.vo";

describe("EmailVo", () => {
  it("Should able to create a valid email", () => {
    const email = EmailVO.create("luan@mail.com");

    expect(email).toBeInstanceOf(EmailVO);
    expect(email.value).toBe("luan@mail.com");
    expect(email).toBeTruthy();
  });

  it("Should normalize email to lowercase", () => {
    const email = EmailVO.create("User@Test.COM");

    expect(email.value).toBe("user@test.com");
  });

  it("Should trim spaces", () => {
    const email = EmailVO.create("   user@test.com   ");

    expect(email.value).toBe("user@test.com");
  });

  it("Should trim + lowercase together", () => {
    const email = EmailVO.create("  USER@Test.COM  ");

    expect(email.value).toBe("user@test.com");
  });

  it("Should throw when email is empty", () => {
    expect(() => EmailVO.create("")).toThrow();
  });

  it("Should throw when email has no @", () => {
    expect(() => EmailVO.create("usertest.com")).toThrow();
  });

  it("Should throw when email has no domain", () => {
    expect(() => EmailVO.create("user@")).toThrow();
  });

  it("Should accept subdomains", () => {
    const email = EmailVO.create("user@mail.service.com");

    expect(email.value).toBe("user@mail.service.com");
  });

  it("Should accept plus alias", () => {
    const email = EmailVO.create("user+alias@test.com");

    expect(email.value).toBe("user+alias@test.com");
  });
});
