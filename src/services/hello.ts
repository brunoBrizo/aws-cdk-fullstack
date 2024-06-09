import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const s3Client = new S3Client({});

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  const buckets = (await s3Client.send(new ListBucketsCommand({}))).Buckets;

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: `This is the list of buckets: ${buckets
        ?.map((bucket) => bucket.Name)
        .join(", ")}`,
    }),
  };

  return result;
}
