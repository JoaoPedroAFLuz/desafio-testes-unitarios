import { makeStatement } from "../../../../shared/test/factories/statement-factory";
import { makeUser } from "../../../../shared/test/factories/user-factory";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get user balance", () => {
  beforeAll(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get user balance", async () => {
    const newUser = makeUser();
    const user = await inMemoryUsersRepository.create(newUser);

    const deposit = makeStatement({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 500,
    });

    const firstStatement = await inMemoryStatementsRepository.create(deposit);

    const withdraw = makeStatement({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 250,
    });

    const secondStatement = await inMemoryStatementsRepository.create(withdraw);

    const response = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(response.statement).toHaveLength(2);
    expect(response.statement).toMatchObject([firstStatement, secondStatement]);
    expect(response.balance).toBe(
      firstStatement.amount - secondStatement.amount
    );
  });

  it("should not be able to get balance with invalid user id", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'invalid-user-id' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
