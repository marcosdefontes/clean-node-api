import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

export const throwError = (): never => {
  throw new Error();
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  test("Should call hash with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a valid hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });

  test("Should throw if hash throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(throwError);

    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  test("Should call compare with correct values", async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  test("Should return true if compare succeeds", async () => {
    const sut = makeSut();
    const compare = await sut.compare("any_value", "any_hash");
    expect(compare).toBeTruthy();
  });

  test("Should return false if compare fails", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false);
    const compare = await sut.compare("any_value", "any_hash");
    expect(compare).toBeFalsy();
  });

  test("Should throw if compare throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.compare("any_value", "any_hash");
    expect(promise).rejects.toThrow();
  });
});
