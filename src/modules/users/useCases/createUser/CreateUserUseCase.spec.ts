import { makeUser } from "../../../../shared/test/factories/user-factory";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const newUser = makeUser();

    const response = await createUserUseCase.execute(newUser);

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user with in use e-mail", () => {
    expect(async () => {
      const userOne = makeUser({ email: "same-email@example.com" });

      const userTwo = makeUser({ email: "same-email@example.com" });

      await createUserUseCase.execute(userOne);
      await createUserUseCase.execute(userTwo);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
