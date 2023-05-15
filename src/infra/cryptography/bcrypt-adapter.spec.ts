import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const val = "any_value";
    await sut.encrypt(val);
    expect(hashSpy).toHaveBeenCalledWith(val, salt);
  });
  test("Should return a hash on success", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const val = "any_value";
    const hash = await sut.encrypt(val);
    expect(hash).toBe("hash");
  });
});
