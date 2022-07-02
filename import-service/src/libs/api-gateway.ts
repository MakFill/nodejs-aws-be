import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const allowHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

type FormatJSONResponseParams = {
  response: any;
  statusCode?: number;
};

export const formatJSONResponse = ({ response, statusCode = 200 }: FormatJSONResponseParams) => ({
  statusCode,
  body: JSON.stringify(response),
  headers: allowHeaders,
});
