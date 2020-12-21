import {useDecorators} from "@tsed/core";
import {Authorize} from "@tsed/passport";
import {In, Security} from "@tsed/schema";

export function Auth(): MethodDecorator {
  return useDecorators(Authorize("jwt"), Security("bearerAuth"), In("header").Name("Authorize"));
}
