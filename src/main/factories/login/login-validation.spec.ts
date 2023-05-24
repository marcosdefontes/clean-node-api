import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators";
import { EmailValidator, Validation } from "../../../presentation/protocols";
import { makeLoginValidation } from "./login-validation";

jest.mock("../../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("Login Validation Factory", () => {
  test("Should call validation composite if all validations", () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
