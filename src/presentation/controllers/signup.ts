import { badRequest, serverError } from "../helpers/http-helpers";
import { InvalidParamError, MissingParamError } from "./errors";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "./protocols";

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
      const { email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
