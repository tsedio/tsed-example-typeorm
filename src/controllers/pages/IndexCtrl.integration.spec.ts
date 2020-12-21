import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../Server";
import {bootstrapServer} from "../../../test/helpers/bootstrapServer";

describe("IndexCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  beforeAll(bootstrapServer(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  // then run your test
  describe("GET /", () => {
    it("should index page", async () => {
      const response = await request.get("/").expect(200);

      expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
      expect(response.text).toContain("OpenSpec 3.0.1");
    });
  });
});
