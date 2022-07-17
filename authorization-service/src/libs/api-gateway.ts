import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

type FormatJSONResponseParams = {
  response: any;
  statusCode?: number;
};

export const formatJSONResponse = ({ response, statusCode = 200 }: FormatJSONResponseParams) => ({
  statusCode,
  body: JSON.stringify(response),
});
