import { InvalidParamError } from "../../errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation("field", "fieldToCompare");
describe("Compare Fields Validation", () => {
  test("should return a MissingParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any", fieldToCompare: "another" });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });
  test("should return null if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any", fieldToCompare: "any" });
    expect(error).toBeFalsy();
  });
});
