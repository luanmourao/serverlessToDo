import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";

interface IToDo {
  user_id: string;
  title: string;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async (event) => {

  const { title, deadline } = JSON.parse(event.body) as IToDo;

  const { user_id } = event.pathParameters;

  const id = uuidV4();

  const post = await document.put({
    TableName: "todos",
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline: new Date(deadline)
    }
  }).promise();

  console.log(post.$response)

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "To-Do created!",
      name: title,
      deadline: deadline
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
};