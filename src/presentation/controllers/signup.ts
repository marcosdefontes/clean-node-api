import { badRequest } from "../helpers/http-helpers";
import { MissingParamError } from "./errors/missing-param-error";
import { HttpRequest, HttpResponse } from "./protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFiels = ["name", "email", "password"];
    for (const field of requiredFiels)
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
  }
}
