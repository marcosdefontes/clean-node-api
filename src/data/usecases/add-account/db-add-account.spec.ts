import { AddAccountRepository } from "../../protocols/add-account-repository";
import { DbAddAccount } from "./db-add-account";
import {
  AccountModel,
  AddAccountModel,
  Encrypter,
} from "./db-add-account-protocols";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: any;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({ ...accountData, password: "hashed_password", id: "valid_id" })
      );
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  // test("Should throw if Encrypter throws", async () => {
  //   const { sut, encrypterStub } = makeSut();
  //   jest
  //     .spyOn(encrypterStub, "encrypt")
  //     .mockReturnValueOnce(
  //       new Promise((resolve, reject) => reject(new Error()))
  //     );
  //   const accountData = {
  //     name: "valid_name",
  //     email: "valid_email",
  //     password: "valid_password",
  //   };
  //   const promise = sut.add(accountData);
  //   await expect(promise).rejects.toThrow();
  // });
  test("Shoul call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: "hashed_password",
    });
  });
});
