export class EmailVO {
  private readonly _email: string;

  get value(): string {
    return this._email;
  }

  static create(email: string): EmailVO {
    if (!EmailVO.isValid(email)) {
      throw new Error("Email addresses is invalid");
    }
    return new EmailVO(email.trim().toLowerCase());
  }

  private static isValid(email: string): boolean {
    if (!email) return false;

    const trimmed: string = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  }

  private constructor(email: string) {
    this._email = email;
  }
}
