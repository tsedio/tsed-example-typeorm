import {join} from "path";
import {Configuration, Inject, InjectorService} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import {config} from "./config";
import * as rest from "./controllers/rest";
import * as pages from "./controllers/pages";
import "./protocols"
import {DataSource} from "typeorm";
import {USER_REPOSITORY} from "./repositories/UserRepository";
import {deserialize} from "@tsed/json-mapper";
import { User } from "./entities/User";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/rest": [
      ...Object.values(rest)
    ],
    "/": [
      ...Object.values(pages)
    ]
  },
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  }
})
export class Server {
  @Inject()
  protected injector: InjectorService;


  async $onReady(): Promise<void> {
    const repository = this.injector.get<USER_REPOSITORY>(USER_REPOSITORY)!;

    const count = await repository.count();

    if (!count) {
      const user = deserialize(
        {
          email: process.env.ROOT_EMAIL || "admin@admin.fr",
          password: process.env.ROOT_PWD || "admin",
          firstName: "admin",
          lastName: "admin",
          age: 18
        },
        {type: User}
      );

      await repository.save(user);
    }
  }
}
