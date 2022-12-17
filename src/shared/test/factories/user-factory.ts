import { ICreateUserDTO } from "../../../modules/users/useCases/createUser/ICreateUserDTO";

type Override = Partial<ICreateUserDTO>;

export function makeUser(override: Override = {}): ICreateUserDTO {
  return {
    name: "User",
    email: "user@example.com",
    password: "12345",
    ...override,
  };
}
