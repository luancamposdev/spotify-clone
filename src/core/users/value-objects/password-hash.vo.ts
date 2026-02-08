export class PasswordHashVO {
  private readonly _hash: string;

  public get value(): string {
    return this._hash;
  }

  // =========================
  // Factory — password plain → hash
  // =========================
  static async fromPlain(plain: string): Promise<PasswordHashVO> {
    if (!PasswordHashVO.isValidPlain(plain)) {
      throw new Error("Invalid password. Must be at least 6 characters long.");
    }

    const hash = await Bun.password.hash(plain, "bcrypt");

    return new PasswordHashVO(hash);
  }

  // =========================
  // Factory — já headache (DB)
  // =========================
  static fromHash(hash: string): PasswordHashVO {
    if (!PasswordHashVO.isValidHash(hash)) {
      throw new Error("Invalid password hash format.");
    }

    return new PasswordHashVO(hash);
  }

  // =========================
  // Verify encapsulate
  // =========================
  public async verify(plain: string): Promise<boolean> {
    return Bun.password.verify(plain, this._hash);
  }

  // =========================
  // Validation
  // =========================

  private static isValidPlain(password: string): boolean {
    if (!password) return false;
    return password.trim().length >= 6;
  }

  private static isValidHash(hash: string): boolean {
    return hash.length > 20;
  }

  private constructor(hash: string) {
    this._hash = hash;
  }

  public toString(): string {
    return "[PasswordHash]";
  }
}
