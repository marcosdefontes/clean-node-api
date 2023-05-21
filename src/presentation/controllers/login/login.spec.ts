import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpRequest } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator();
  const sut = new LoginController(emailValidator);
  return { sut, emailValidatorStub: emailValidator };
};

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: "any@mail.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
  test("Should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest: HttpRequest = {
      body: {
        email: "any@mail.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });
  test("Should call EmailValidator with correct params", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest: HttpRequest = {
      body: {
        email: "any@mail.com",
        password: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any@mail.com");
  });
});
