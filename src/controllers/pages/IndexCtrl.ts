import {Constant, Controller, Get, HeaderParams, View} from "@tsed/common";
import {Hidden, SwaggerSettings} from "@tsed/swagger";

@Hidden()
@Controller("/")
export class IndexCtrl {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  @Get("/")
  @View("index.ejs")
  get(@HeaderParams("x-forwarded-proto") protocol: string, @HeaderParams("host") host: string): Record<string, unknown> {
    const hostUrl = `${protocol || "http"}://${host}`;

    return {
      BASE_URL: hostUrl,
      docs: this.swagger.map((conf) => {
        return {
          url: hostUrl + conf.path,
          ...conf
        };
      })
    };
  }
}
