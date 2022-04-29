import {BodyParams, Inject} from "@tsed/common";
import {Forbidden} from "@tsed/exceptions";
import {OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport-local";
import {User} from "../entities/User";
import {USER_REPOSITORY} from "../repositories/UserRepository";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  async $onVerify(@BodyParams() user: User): Promise<User> {
    const {email} = user;
    const found = await this.repository.findOneBy({email});

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.repository.create(user);
  }
}
