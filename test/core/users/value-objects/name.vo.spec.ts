import {describe, expect, it} from "bun:test";
import {NameVO} from "@core/users/value-objects/name.vo";

describe("NameVO", () => {
	it("should create a name", () => {
		const name = NameVO.create("Luan Campos");

		expect(name.value).toBe("Luan Campos");
		expect(name.value).toEqual("Luan Campos");
	});

	it("Should be able to remove spaces on the edges", () => {
		const name = NameVO.create(" Luan Campos ");

		expect(name.value).toBe("Luan Campos");
	});

	it("Should not be able to create a name with less than 3 characters", () => {
		expect(() => NameVO.create("Lu")).toThrow(
			"Invalid name, Please enter valid name.",
		);
	});
});
