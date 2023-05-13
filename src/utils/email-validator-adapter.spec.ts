import { EmvailValidatorAdapter } from "./email-validator";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe("EmailValidator Adapter", () => {
  test("Should return false if validator return false", () => {
    const sut = new EmvailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@gmail.com");
    expect(isValid).toBe(false);
  });
  test("Should return true if validator return true", () => {
    const sut = new EmvailValidatorAdapter();
    const isValid = sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });
  test("Should call validator if correct email", () => {
    const sut = new EmvailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    const email = "any_email@mail.com";
    sut.isValid(email);
    expect(isEmailSpy).toHaveBeenCalledWith(email);
  });
});
