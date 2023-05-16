import request from "supertest";
import app from "../config/app";

describe("CORS Middleware", () => {
  test("Should enable CORS", async () => {
    app.get("/text_cors", (req, res) => {
      res.send();
    });
    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*");
  });
});
