import {Req} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {Arg, OnVerify, Protocol} from "@tsed/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "../entities/User";
import {USER_REPOSITORY, UserRepository} from "../repositories/UserRepository";

@Protocol({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "thisismysupersecretprivatekey1",
    issuer: process.env.JWT_ISSUER || "localhost",
    audience: process.env.JWT_AUDIENCE || "localhost"
  }
})
export class JwtProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  async $onVerify(@Req() req: Express.Request, @Arg(0) jwtPayload: Record<string, unknown>): Promise<User> {
    const user = await this.repository.findOneBy({id: jwtPayload.sub as number});

    if (!user) {
      throw new Unauthorized("Wrong token");
    }

    req.user = user;

    return user;
  }
}
