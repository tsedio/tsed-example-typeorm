import {BodyParams, Inject, Req} from "@tsed/common";
import {OnVerify, Protocol} from "@tsed/passport";
import {Email} from "@tsed/schema";
import {BasicStrategy} from "passport-http";
import {User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";

@Protocol({
  name: "basic",
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify {
  @Inject()
  private userRepository: UserRepository;

  async $onVerify(
    @Req() request: Req,
    @BodyParams("username") @Email() username: string,
    @BodyParams("password") password: string
  ): Promise<User | boolean> {
    const user = await this.userRepository.findOne({email: username});

    if (!user) {
      return false;
    }

    if (!user.verifyPassword(password)) {
      return false;
    }

    return user;
  }
}
