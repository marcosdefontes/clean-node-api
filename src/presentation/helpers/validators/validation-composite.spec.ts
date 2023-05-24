import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols";
import { ValidationComposite } from "./validation-composite";

interface SutTyes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};
const makeSut = (): SutTyes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe("Validation Composite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({ field: "any" });
    expect(error).toEqual(new MissingParamError("field"));
  });
  test("Should the first error if more than one Validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any" });
    expect(error).toEqual(new Error());
  });
  test("Should not return error error if validation succeeds", () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: "any" });
    expect(error).toBeFalsy();
  });
});
