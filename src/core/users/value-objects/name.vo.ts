export class NameVO {
  private readonly _name: string;

  public get value(): string {
    return this._name;
  }

  static create(name: string): NameVO {
    if (!NameVO.isValid(name)) {
      throw new Error("Invalid name, Please enter valid name.");
    }

    return new NameVO(name.trim());
  }

  private static isValid(name: string): boolean {
    if (!name) return false;

    const trimmed: string = name.trim();
    const parts: string[] = trimmed.split(/\s+/);

    if (parts.length !== 2) return false;

    return parts.every((part) => /^[A-Za-zÀ-ÿ]{2,}$/.test(part));
  }

  constructor(name: string) {
    this._name = name;
  }
}
