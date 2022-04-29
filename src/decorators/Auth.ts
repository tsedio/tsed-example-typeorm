import {useDecorators} from "@tsed/core";
import {Authorize} from "@tsed/passport";
import {Security} from "@tsed/schema";

export function Auth(): MethodDecorator {
  return useDecorators(Authorize("jwt"), Security("jwt"));
}
