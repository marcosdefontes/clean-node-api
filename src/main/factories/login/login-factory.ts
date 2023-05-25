import env from "../../config/env";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeLoginValidation } from "./login-validation-factory";
import { Controller } from "../../../presentation/protocols";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";

export const makeLoginController = (): Controller => {
  const logMongoRepository = new LogMongoRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );

  return new LogControllerDecorator(loginController, logMongoRepository);
};
