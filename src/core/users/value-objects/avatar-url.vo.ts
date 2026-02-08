export class AvatarUrlVO {
	private readonly _url: string;

	public get value(): string {
		return this._url;
	}

	static create(url: string | null | undefined): AvatarUrlVO | null {
		if (!url) return null;

		const trimmed = url.trim();

		if (!AvatarUrlVO.isValid(trimmed)) {
			throw new Error("Invalid avatar url, Please enter valid avatar url.");
		}

		return new AvatarUrlVO(trimmed);
	}

	public static isValid(url: string | null | undefined): boolean {
		if (!url) return false;

		try {
			const parsed = new URL(url.trim());

			return parsed.protocol === "http:" || parsed.protocol === "https:";
		} catch {
			return false;
		}
	}

	private constructor(url: string) {
		this._url = url;
	}

	public toString(): string {
		return this._url;
	}
}
