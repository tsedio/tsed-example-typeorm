import {Description, Example, Format, Groups, Minimum, Required} from "@tsed/schema";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @Description("Database assigned id")
  @PrimaryGeneratedColumn()
  @Groups("!creation", "details")
  id: number;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Column({unique: true})
  email: string;

  @Groups("credentials")
  @Description("User password")
  @Example("/5gftuD/")
  @Column()
  @Required()
  password: string;

  @Description("User first name")
  @Column()
  @Required()
  @Groups("details")
  firstName: string;

  @Description("User last name")
  @Column()
  @Required()
  @Groups("details")
  lastName: string;

  @Description("User age")
  @Column()
  @Minimum(18)
  @Example(18)
  @Groups("details")
  age: number;

  verifyPassword(password: string) {
    return this.password === password;
  }
}
