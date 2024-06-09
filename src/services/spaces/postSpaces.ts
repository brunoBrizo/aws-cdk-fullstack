import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsSpaceEntry } from "../shared/validator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { createRandomId, parseJSON } from "../shared/utils";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item = parseJSON(event.body!);
  item.id = randomId;

  validateAsSpaceEntry(item);

  await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
