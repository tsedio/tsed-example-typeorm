import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {bootstrapServer} from "../../../../test/helpers/bootstrapServer";
import {User} from "../../../entities/User";
import {UserRepository} from "../../../repositories/UserRepository";
import {PassportCtrl} from "./PassportCtrl";

describe("PassportCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(
    bootstrapServer({
      mount: {
        "/rest": [PassportCtrl]
      }
    })
  );

  beforeAll(async (done) => {
    request = SuperTest(PlatformTest.callback());

    // create initial user
    const usersRepository = PlatformTest.get<UserRepository>(UserRepository);
    const user = new User();
    user.id = 1;
    user.password = "password";
    user.email = "admin@tsed.io";
    user.firstName = "John";
    user.lastName = "Doe";
    user.age = 18;

    await usersRepository.save(user);

    done();
  });
  afterAll(PlatformTest.reset);

  describe("POST /rest/auth/login", () => {
    it("should return a user", async () => {
      const response = await request
        .post("/rest/auth/login")
        .send({
          email: "admin@tsed.io",
          password: "password"
        })
        .expect(200);

      expect(response.body.bearer_format).toEqual("Bearer");
    });

    it("should throw an error if user doesn't exists", async () => {
      const response = await request
        .post("/rest/auth/login")
        .send({
          email: "admin2@tsed.io",
          password: "password"
        })
        .expect(401);

      expect(response.text).toEqual("Unauthorized");
    });

    it("should throw an error if the password is missing", async () => {
      const response = await request
        .post("/rest/auth/login")
        .send({
          email: "admin2@tsed.io"
        })
        .expect(400);

      expect(response.text).toEqual("Bad Request");
    });

    it("should throw an error if the email is missing", async () => {
      const response = await request.post("/rest/auth/login").send({}).expect(400);

      expect(response.text).toEqual("Bad Request");
    });
  });
});
