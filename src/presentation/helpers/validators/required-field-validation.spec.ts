import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation("field");
describe("Required Field Validation", () => {
  test("should return a MissingParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ otherField: "any" });
    expect(error).toEqual(new MissingParamError("field"));
  });
  test("should return null if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any" });
    expect(error).toBeFalsy();
  });
});
