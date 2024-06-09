import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/dataStack";
import { LambdaStack } from "./stacks/lambdaStack";
import { ApiStack } from "./stacks/apiStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");

const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});

new ApiStack(app, "ApiStack", {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
});
