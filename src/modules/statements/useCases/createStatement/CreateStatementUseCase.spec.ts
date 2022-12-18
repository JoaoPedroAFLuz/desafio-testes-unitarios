import { makeStatement } from "../../../../shared/test/factories/statement-factory";
import { makeUser } from "../../../../shared/test/factories/user-factory";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const newUser = makeUser();
    const user = await inMemoryUsersRepository.create(newUser);

    const newStatement = makeStatement({ user_id: user.id });
    const statement = await createStatementUseCase.execute(newStatement);

    expect(statement).toHaveProperty("id");
    expect(statement).toMatchObject(newStatement);
  });

  it("should not be able to create a new statement with invalid user id", () => {
    expect(async () => {
      const newStatement = makeStatement({ user_id: "invalid user id" });
      await createStatementUseCase.execute(newStatement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw a value greater then the account balance", () => {
    expect(async () => {
      const newUser = makeUser();
      const user = await inMemoryUsersRepository.create(newUser);

      const deposit = makeStatement({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 500,
      });

      await createStatementUseCase.execute(deposit);

      const withdraw = makeStatement({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 1000,
      });

      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
