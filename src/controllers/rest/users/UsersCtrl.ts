import {BodyParams, Controller, Get, Inject, PathParams, Post} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Groups, Name, Returns} from "@tsed/schema";
import {Auth} from "../../../decorators/Auth";
import {User} from "../../../entities/User";
import {UserRepository} from "../../../repositories/UserRepository";

@Controller("/users")
@Name("Users")
export class UsersCtrl {
  @Inject()
  private userRepository: UserRepository;

  @Post("/")
  @Auth()
  @(Returns(200, User).Groups("details"))
  create(@BodyParams() @Groups("creation", "credentials", "details") user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  @Get("/:id")
  @Auth()
  @(Returns(200, User).Groups("details"))
  @(Returns(404).Description("User not found"))
  async get(@PathParams("id") id: string): Promise<User | undefined> {
    const user = await this.userRepository.findByID(id);

    if (!user) {
      throw new NotFound("User not found");
    }

    return;
  }

  @Get("/")
  @Auth()
  @(Returns(200, Array).Of(User).Groups("details"))
  async getList(): Promise<User[]> {
    return this.userRepository.find();
  }
}
