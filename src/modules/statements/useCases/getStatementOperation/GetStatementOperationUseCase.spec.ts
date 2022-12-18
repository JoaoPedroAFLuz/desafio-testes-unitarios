import { makeStatement } from "../../../../shared/test/factories/statement-factory";
import { makeUser } from "../../../../shared/test/factories/user-factory";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operation", () => {
  beforeAll(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get user's statement operation", async () => {
    const newUser = makeUser();
    const user = await inMemoryUsersRepository.create(newUser);

    const newStatement = makeStatement({ user_id: user.id! });
    const statement = await inMemoryStatementsRepository.create(newStatement);

    const result = await getStatementOperationUseCase.execute({
      user_id: statement.user_id,
      statement_id: statement.id!,
    });

    expect(result).toEqual(statement);
  });

  it("should not ble able to get statement operation with invalid user id", () => {
    expect(async () => {
      const newStatement = makeStatement();
      const statement = await inMemoryStatementsRepository.create(newStatement);

      await getStatementOperationUseCase.execute({
        user_id: "invalid-id",
        statement_id: statement.id!,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not ble able to get statement operation with invalid statement id", () => {
    expect(async () => {
      const newUser = makeUser();
      const user = await inMemoryUsersRepository.create(newUser);

      const newStatement = makeStatement({ user_id: user.id });
      const statement = await inMemoryStatementsRepository.create(newStatement);

      await getStatementOperationUseCase.execute({
        user_id: newStatement.user_id,
        statement_id: 'invalid-statement-id',
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
