import { badRequest } from "../helpers/http-helpers";
import { MissingParamError } from "./errors/missing-param-error";
import { Controller } from "./protocols/controller";
import { HttpRequest, HttpResponse } from "./protocols/http";

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFiels = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFiels)
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
  }
}
