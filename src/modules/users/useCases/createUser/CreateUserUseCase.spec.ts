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
    const newUser = {
      name: "User name",
      email: "user@example.com",
      password: "12345",
    };

    const response = await createUserUseCase.execute(newUser);

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user with in use e-mail", () => {
    expect(async () => {
      const userOne = {
        name: "User One",
        email: "user@example.com",
        password: "12345",
      };

      const userTwo = {
        name: "User Two",
        email: "user@example.com",
        password: "54321",
      };

      await createUserUseCase.execute(userOne);
      await createUserUseCase.execute(userTwo);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
