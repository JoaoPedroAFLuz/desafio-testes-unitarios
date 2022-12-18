import { OperationType } from "../../../modules/statements/entities/Statement";
import { ICreateStatementDTO } from "../../../modules/statements/useCases/createStatement/ICreateStatementDTO";

type Override = Partial<ICreateStatementDTO>;

export function makeStatement(override: Override = {}): ICreateStatementDTO {
  return {
    user_id: "f884c3ef-c638-47e6-81a9-1ccd3a6e64ab",
    description: "Some description",
    amount: 500,
    type: OperationType.DEPOSIT,
    ...override,
  };
}
