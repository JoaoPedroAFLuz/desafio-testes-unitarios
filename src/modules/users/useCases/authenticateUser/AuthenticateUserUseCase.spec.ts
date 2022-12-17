import { hash } from "bcryptjs";
import { makeUser } from "../../../../shared/test/factories/user-factory";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    const newUser = makeUser();
    const hashedPassword = await hash(newUser.password, 8);

    await inMemoryUsersRepository.create({
      ...newUser,
      password: hashedPassword,
    });

    const response = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password,
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user.name).toEqual(newUser.name);
  });

  it("should not be able to authenticate an unregistered user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@example.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate user with incorrect e-mail", () => {
    expect(async () => {
      const newUser = {
        name: "User name",
        email: "user@example.com",
        password: "12345",
      };
      const hashedPassword = await hash(newUser.password, 8);

      await inMemoryUsersRepository.create({
        ...newUser,
        password: hashedPassword,
      });

      await authenticateUserUseCase.execute({
        email: "wrong@example.com",
        password: newUser.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate user with incorrect password", () => {
    expect(async () => {
      const newUser = {
        name: "User name",
        email: "user@example.com",
        password: "12345",
      };
      const hashedPassword = await hash(newUser.password, 8);

      await inMemoryUsersRepository.create({
        ...newUser,
        password: hashedPassword,
      });

      await authenticateUserUseCase.execute({
        email: newUser.email,
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
