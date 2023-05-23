import * as ProtocolsIndex from "./index";

describe("ProtocolsIndex", () => {
  it("should have exports", () => {
    expect(typeof ProtocolsIndex).toBe("object");
  });

  it("should not have undefined exports", () => {
    Object.keys(ProtocolsIndex).forEach((exportKey) =>
      expect(Boolean(ProtocolsIndex[exportKey])).toBe(true)
    );
  });
});
