export class UnathorizedError extends Error {
  constructor() {
    super("Unathorized");
    this.name = "ServerError";
  }
}
