import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

export const throwError = (): never => {
  throw new Error();
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct value", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const val = "any_value";
    await sut.encrypt(val);
    expect(hashSpy).toHaveBeenCalledWith(val, salt);
  });
  test("Should return a hash on success", async () => {
    const sut = makeSut();
    const val = "any_value";
    const hash = await sut.encrypt(val);
    expect(hash).toBe("hash");
  });
  test("Should throw if hash throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(throwError);
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
