import {
  badRequest,
  ok,
  serverError,
  unathorized,
} from "../../helpers/http/http-helper";
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from "./login-protocols";

export class LoginController implements Controller {
  private readonly validation;
  private readonly authentication;
  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unathorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
