import { badRequest, serverError } from "../helpers/http-helpers";
import { InvalidParamError, MissingParamError } from "./errors";
import { Controller } from "./protocols/controller";
import { EmailValidator } from "./protocols/email-validator";
import { HttpRequest, HttpResponse } from "./protocols/http";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFiels = ["name", "email", "password", "passwordConfirmation"];
    try {
      for (const field of requiredFiels)
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
