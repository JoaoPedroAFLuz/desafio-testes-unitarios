import { makeUser } from "../../../../shared/test/factories/user-factory";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const newUser = makeUser();

    const user = await inMemoryUsersRepository.create(newUser);

    const response = await showUserProfileUseCase.execute(user.id!);

    expect(response).toEqual(user);
  });

  it("should not be able to show unregistered user profile", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("12345");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
