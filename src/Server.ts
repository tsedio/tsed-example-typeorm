import "@tsed/ajv";
import {InjectorService, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/typeorm";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import typeormConfig from "./config/typeorm";
import {IndexCtrl} from "./controllers/pages/IndexCtrl";
import {User} from "./entities/User";
import {UserRepository} from "./repositories/UserRepository";
// import {UserRepository} from "./repositories/UserRepository";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/rest": [`${rootDir}/controllers/**/*.ts`],
    "/": [IndexCtrl]
  },
  passport: {
    userInfoModel: User
  },
  componentsScan: [`${rootDir}/protocols/**/*.ts`],
  swagger: [
    {
      path: "/api-docs",
      specVersion: "3.0.1",
      spec: {
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Call POST /rest/auth/login to get the access token"
            }
          }
        }
      }
    }
  ],
  typeorm: typeormConfig,
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  @Inject()
  injector: InjectorService;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }

  async $onReady(): Promise<void> {
    const repository = this.injector.get<UserRepository>(UserRepository)!;
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
