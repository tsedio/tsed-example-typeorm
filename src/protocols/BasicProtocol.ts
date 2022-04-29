import {BodyParams, Inject, Req} from "@tsed/common";
import {OnVerify, Protocol} from "@tsed/passport";
import {Email} from "@tsed/schema";
import {BasicStrategy} from "passport-http";
import {User} from "../entities/User";
import {USER_REPOSITORY} from "../repositories/UserRepository";

@Protocol({
  name: "basic",
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  async $onVerify(
    @Req() request: Req,
    @BodyParams("username") @Email() username: string,
    @BodyParams("password") password: string
  ): Promise<User | boolean> {
    const user = await this.repository.findOneBy({email: username});

    if (!user) {
      return false;
    }

    if (!user.verifyPassword(password)) {
      return false;
    }

    return user;
  }
}
