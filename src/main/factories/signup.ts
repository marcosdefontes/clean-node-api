import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignupController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepo = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepo);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    addAccount
  );
  return new LogControllerDecorator(signUpController);
};
