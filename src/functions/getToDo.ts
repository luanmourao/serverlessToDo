import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  // const response = await document.query({
  //   TableName: "todos",
  //   KeyConditionExpression: "user_id = :user_id",
  //   ExpressionAttributeValues: {
  //     ":user_id": {
  //       "S": user_id
  //     }
  //   }
  // }).promise();

  const response = await document.scan({
    TableName: "todos",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    }
  }).promise();

  const userToDos = response.Items;
  console.log(userToDos);

  if (userToDos.length > 0) {
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Seus To-Dos:",
        userToDos
      })
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Usuário sem To-Dos cadastrados"
    })
  };
}

