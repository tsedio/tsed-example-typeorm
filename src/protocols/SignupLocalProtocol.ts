import {BodyParams, Inject} from "@tsed/common";
import {Forbidden} from "@tsed/exceptions";
import {OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport-local";
import {User} from "../entities/User";
import {UserRepository} from "../repositories/UserRepository";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify {
  @Inject()
  private userRepository: UserRepository;

  async $onVerify(@BodyParams() user: User): Promise<User> {
    const {email} = user;
    const found = await this.userRepository.findOne({email});

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.userRepository.create(user);
  }
}
