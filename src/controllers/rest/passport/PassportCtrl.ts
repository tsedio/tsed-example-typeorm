import {BodyParams, Controller, Get, Post, Req} from "@tsed/common";
import {Authenticate, Authorize} from "@tsed/passport";
import {Groups, Name, object, Returns, string} from "@tsed/schema";
import {Auth} from "../../../decorators/Auth";
import {User} from "../../../entities/User";
import "../../../interfaces";

const JwtSchema = object()
  .properties({
    bearer_format: string().required().example("Bearer"),
    access_token: string().required()
  })
  .label("JwtSchema");

@Controller("/auth")
@Name("Auth")
export class PassportCtrl {
  @Post("/login")
  @Authenticate("login", {failWithError: false})
  @(Returns(200).ContentType("application/json").Schema(JwtSchema))
  @(Returns(400).Description("Validation error"))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Req("user") jwt: string, @BodyParams() @Groups("credentials") credentials: User): Record<string, string> {
    // FACADE
    return {
      bearer_format: "Bearer",
      access_token: jwt
    };
  }

  @Post("/signup")
  @Authenticate("signup")
  @(Returns(201, User).Groups("details"))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signup(@Req() req: Req, @BodyParams() @Groups("creation", "credentials", "details") user: User): User {
    // FACADE
    return req.user;
  }

  @Get("/userinfo")
  @Auth()
  @(Returns(200, User).Groups("details"))
  getUserInfo(@Req() req: Req): User {
    // FACADE
    return req.user;
  }

  @Get("/logout")
  logout(@Req() req: Express.Request): void {
    req.logout();
  }

  @Get("/connect/:protocol")
  @Authorize(":protocol")
  @(Returns(200, User).Groups("details"))
  connectProtocol(@Req() req: Req): User {
    // FACADE
    return req.user;
  }

  @Get("/connect/:protocol/callback")
  @Authorize(":protocol")
  @(Returns(200, User).Groups("details"))
  connectProtocolCallback(@Req() req: Req): User {
    // FACADE
    return req.user;
  }
}
