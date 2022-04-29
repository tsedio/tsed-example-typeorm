import {BodyParams, Controller, Get, Inject, PathParams, Post} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Groups, Name, Returns} from "@tsed/schema";
import {Auth} from "../../../decorators/Auth";
import {User} from "../../../entities/User";
import {USER_REPOSITORY} from "../../../repositories/UserRepository";

@Controller("/users")
@Name("Users")
export class UsersCtrl {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Post("/")
  @Auth()
  @(Returns(200, User).Groups("details"))
  create(@BodyParams() @Groups("creation", "credentials", "details") user: User): Promise<User> {
    return this.repository.save(user);
  }

  @Get("/:id")
  @Auth()
  @(Returns(200, User).Groups("details"))
  @(Returns(404).Description("User not found"))
  async get(@PathParams("id") id: number): Promise<User | undefined> {
    const user = await this.repository.findOneBy({id});

    if (!user) {
      throw new NotFound("User not found");
    }

    return;
  }

  @Get("/")
  @Auth()
  @(Returns(200, Array).Of(User).Groups("details"))
  async getList(): Promise<User[]> {
    return this.repository.find();
  }
}
