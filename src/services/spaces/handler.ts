import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { updateSpace } from "./updateSpace";
import { deleteSpace } from "./deleteSpace";
import { JsonError, MissingFieldError } from "../shared/validator";
import { addCorsHeader } from "../shared/utils";
import { getSpaces } from "./getSpaces";
import { postSpaces } from "./postSpaces";

const ddbClient = new DynamoDBClient({});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult = {
    statusCode: 400,
    body: JSON.stringify({ message: "Invalid request" }),
  };

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        response = getResponse;
        break;
      case "POST":
        const postResponse = await postSpaces(event, ddbClient);
        response = postResponse;
        break;
      case "PUT":
        const putResponse = await updateSpace(event, ddbClient);
        response = putResponse;
        break;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, ddbClient);
        response = deleteResponse;
        break;
      default:
        break;
    }
  } catch (error: any) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    return {
      statusCode: 500,
      body: error.message,
    };
  }
  addCorsHeader(response);
  return response;
}
