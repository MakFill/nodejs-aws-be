import AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '@functions/importProductsFile/handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const TEST = 'TEST';

describe('importProductsFile', () => {
  afterEach(() => {
    AWSMock.restore('S3');
  });

  test('Should work correctly', async () => {
    AWSMock.mock('S3', 'getSignedUrl', `https://${TEST}`);

    const event: APIGatewayProxyEvent = {
      queryStringParameters: { name: TEST },
    } as any;

    const res = (await importProductsFile(event, null, null)) as APIGatewayProxyResult;
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body)).toEqual(`https://${TEST}`);
  });

  test('Should handle error', async () => {
    const errorMessage = 'Internal server error';
    AWSMock.mock('S3', 'getSignedUrl', () => {
      throw new Error(errorMessage);
    });
    const event: APIGatewayProxyEvent = {
      queryStringParameters: { name: TEST },
    } as any;

    const res = (await importProductsFile(event, null, null)) as APIGatewayProxyResult;

    expect(res.statusCode).toEqual(500);
    expect(JSON.parse(res.body)).toEqual(`Error: ${errorMessage}`);
  });
});
