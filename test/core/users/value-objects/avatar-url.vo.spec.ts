import {describe, expect, it} from "bun:test";
import {AvatarUrlVO} from "@core/users/value-objects/avatar-url.vo";

describe("AvatarUrlVO", () => {
	it("Should be able to create a valid avatar with HTTPS protocol", () => {
		const url = "https://avatars.githubusercontent.com/u/123456789?v=4";
		const avatarUrl = AvatarUrlVO.create(url);

		expect(avatarUrl).toBeInstanceOf(AvatarUrlVO);
		expect(avatarUrl?.value).toBe(url);
		expect(avatarUrl?.value).toEqual(url);
	});

	it("Should trim spaces from url", () => {
		const url = "   https://site.com/avatar.jpg   ";

		const avatar = AvatarUrlVO.create(url);
		expect(avatar?.value).toBe("https://site.com/avatar.jpg");
	});

	it("Should return null when url is null", () => {
		const avatar = AvatarUrlVO.create(null);
		expect(avatar).toBeNull();
	});

	it("Should return null when url is empty string", () => {
		const avatar = AvatarUrlVO.create("");
		expect(avatar).toBeNull();
	});

	it("Should throw error for invalid url format", () => {
		expect(() => {
			AvatarUrlVO.create("not-a-valid-url");
		}).toThrow("Invalid avatar url, Please enter valid avatar url.");
	});

	it("Should throw error for unsupported protocol", () => {
		expect(() => {
			AvatarUrlVO.create("ftp://site.com/profile.png");
		}).toThrow("Invalid avatar url, Please enter valid avatar url.");
	});
});
