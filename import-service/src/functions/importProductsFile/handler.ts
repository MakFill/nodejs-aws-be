import * as AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { APIGatewayProxyResult } from 'aws-lambda';

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<APIGatewayProxyResult> => {
  const catalogName = event.queryStringParameters.name;
  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const params = {
    Bucket: process.env.BUCKET,
    Key: `uploaded/${catalogName}`,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const res = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse({ response: res });
  } catch (err) {
    return formatJSONResponse({ response: err.toString(), statusCode: 500 });
  }
};

export const main = middyfy(importProductsFile);
