import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const val = "any_value";
    await sut.encrypt(val);
    expect(hashSpy).toHaveBeenCalledWith(val, salt);
  });
});
