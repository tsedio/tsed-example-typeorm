import {PlatformTest} from "@tsed/common";
import {deserialize} from "@tsed/json-mapper";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";
import {LoginLocalProtocol} from "./LoginLocalProtocol";

describe("LoginLocalProtocol", () => {
  beforeEach(() => {
    return PlatformTest.create({
      passport: {
        protocols: {
          jwt: {
            name: "jwt",
            useStrategy: Strategy,
            settings: {
              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
              secretOrKey: process.env.JWT_SECRET || "thisismysupersecretprivatekey1",
              issuer: process.env.JWT_ISSUER || "localhost",
              audience: process.env.JWT_AUDIENCE || "localhost"
            }
          }
        }
      }
    });
  });
  afterEach(() => PlatformTest.reset());

  describe("$onVerify()", () => {
    it("should return a user (", async () => {
      // GIVEN
      const email = "email@domain.fr";
      const password = "password";
      const user = new User();
      user.email = email;
      user.password = password;

      const userRepository = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      const protocol: LoginLocalProtocol = await PlatformTest.invoke(LoginLocalProtocol, [
        {
          token: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(deserialize<User>({email, password}, {type: User}));

      // THEN
      expect(userRepository.findOne).toHaveBeenCalledWith({email: "email@domain.fr"});
      expect(typeof result).toEqual("string");
    });
    it("should return false if the password isn't correct", async () => {
      // GIVEN
      const email = "email@domain.fr";
      const password = "password";
      const user = new User();
      user.email = email;
      user.password = `${password}2`;

      const userRepository = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      const protocol: LoginLocalProtocol = await PlatformTest.invoke(LoginLocalProtocol, [
        {
          token: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(deserialize<User>({email, password}, {type: User}));

      // THEN
      expect(userRepository.findOne).toHaveBeenCalledWith({email: "email@domain.fr"});
      expect(result).toEqual(false);
    });
    it("should return a false when user isn't found", async () => {
      // GIVEN
      const email = "email@domain.fr";
      const password = "password";

      const userRepository = {
        findOne: jest.fn().mockResolvedValue(undefined)
      };

      const protocol: LoginLocalProtocol = await PlatformTest.invoke(LoginLocalProtocol, [
        {
          token: UserRepository,
          use: userRepository
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(deserialize<User>({email, password}, {type: User}));

      // THEN
      expect(userRepository.findOne).toHaveBeenCalledWith({email: "email@domain.fr"});
      expect(result).toEqual(false);
    });
  });
});
