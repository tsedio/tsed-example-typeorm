import {registerProvider} from "@tsed/di";
import {User} from "../entities/User";
import {MysqlDataSource} from "../datasources/MysqlDatasource";

export const UserRepository = MysqlDataSource.getRepository(User);
export const USER_REPOSITORY = Symbol.for("UserRepository");
export type USER_REPOSITORY = typeof UserRepository;

registerProvider({
  provide: USER_REPOSITORY,
  useValue: UserRepository
});
