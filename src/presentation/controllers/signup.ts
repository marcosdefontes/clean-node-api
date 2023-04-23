import { badRequest } from "../helpers/http-helpers";
import { InvalidParamError } from "./errors/invalid-param-error";
import { MissingParamError } from "./errors/missing-param-error";
import { ServerError } from "./errors/server-error";
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
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}
